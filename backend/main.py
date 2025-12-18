# main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
from agents import set_tracing_disabled, function_tool, enable_verbose_stdout_logging
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os, asyncio
import traceback
import logging
from logging.handlers import RotatingFileHandler
from middleware.jwt_middleware import JWTBearer
import psycopg
from psycopg.rows import dict_row
from agentss.personalization import personalization_agent
from agentss.translation import translation_agent 
from typing import Any
from typing import Dict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        RotatingFileHandler("app.log", maxBytes=10000000, backupCount=5),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
set_tracing_disabled(disabled=True)
enable_verbose_stdout_logging()

# Initialize FastAPI
app = FastAPI(title="Physical AI Chatbot")

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("NEXT_PUBLIC_FRONTEND_URL"),
                   "http://localhost:3001",
                   "http://localhost:3000",
                   "https://physical-ai-and-humanoid-robotics-x.vercel.app/",
                   "https://physical-ai-and-humanoid-robotics-x.vercel.app/docs/intro"
                   ],     # Default to localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

def get_db_connection():
    """Get a database connection using psycopg[binary]"""
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)

# JWT Bearer token
token_auth_scheme = JWTBearer()


# --- Setup OpenAI/Gemini Model ---
# qwen_api_key = os.getenv("QWEN_API_KEY")
# print(qwen_api_key)
# provider = AsyncOpenAI(
#     api_key=qwen_api_key,
#     base_url="https://portal.qwen.ai/v1/chat/completions"
# )

gemini_api_key = os.getenv("GEMINI_API_KEY")
print(gemini_api_key)
provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

chat_model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash-lite",
    openai_client=provider
)

# --- Setup Embedding Model for Qdrant ---
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

def get_embedding(text: str):
    return embedding_model.encode([text])[0].tolist()


@function_tool
def retrieve(query: str, limit: int = 5):
    embedding = get_embedding(query)
    result = qdrant.query_points(
        collection_name="RoboBook",
        query=embedding,
        limit=limit
    )

    print("QDRANT RAW:", result)

    texts = []
    sources = []
    for point in result.points:
        if "text" in point.payload:
            text_content = point.payload["text"]
            texts.append(text_content)

            # Add comprehensive source information
            source_info = {
                "text_preview": text_content[:100] + "..." if len(text_content) > 100 else text_content,
                "source_file": point.payload.get("source", "Unknown"),
                "chunk_index": point.payload.get("chunk_index", "Unknown"),
                "full_content": text_content
            }
            sources.append(source_info)
        else:
            print("⚠️ WARNING: Qdrant payload has no 'text' key:", point.payload)

    return {"texts": texts, "sources": sources}


# --- Enhanced Agent with Personalization ---
def create_personalized_agent(user_profile: Dict[str, Any] = None):
    # Build personalized instructions based on user profile
    base_instructions = """
You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
To answer the user question, first call the tool `retrieve` with the user query.
Use ONLY the returned content from `retrieve` to answer.
If the answer is not in the retrieved content, say "I don't know".
"""

    # Add personalization if user profile is provided
    if user_profile:
        skill_level = user_profile.get("skill_level", "intermediate")
        hardware_experience = user_profile.get("hardware_experience", "some experience")
        software_experience = user_profile.get("software_experience", "some experience")
        programming_level = user_profile.get("programming_level", "intermediate")
        preferred_learning_style = user_profile.get("preferred_learning_style", "visual")
        preferred_language = user_profile.get("preferred_language", "en")

        # Map language codes to full names for better instructions
        language_names = {
            "en": "English",
            "ur": "Urdu",
            "es": "Spanish",
            "fr": "French",
            "de": "German"
        }
        language_name = language_names.get(preferred_language, preferred_language)

        personalization_instructions = f"""
When responding to the user:
- Adjust complexity based on user's skill level: {skill_level}
- Include relevant examples based on user's experience:
  Hardware: {hardware_experience}, Software: {software_experience}
- Format explanations according to user's preferred learning style: {preferred_learning_style}
- Respond in the user's preferred language: {language_name} ({preferred_language})
- Make the content more relatable and engaging for the user
- If the user asks for translation, you can help with that too
"""
        instructions = base_instructions + personalization_instructions
    else:
        instructions = base_instructions

    return Agent(
        name="PersonalizedAssistant",
        instructions=instructions,
        model=chat_model,
        tools=[retrieve]
    )

# --- Pydantic model for request ---
class ChatRequest(BaseModel):
    query: str
    selection_text: str = ""  # optional
    jwt_token: str = ""  # optional, for personalization
    language: str = "en"  # optional, for language preference

# Pydantic model for personalization request
class PersonalizeRequest(BaseModel):
    chapter_path: str
    raw_md: str
    jwt_token: str = ""

class PersonalizeResponse(BaseModel):
    personalized_md: str
    cached: bool = False

# --- Personalization endpoint ---
@app.post("/personalize", response_model=PersonalizeResponse)
async def personalize_content(request: PersonalizeRequest):
    start_time = asyncio.get_event_loop().time()
    try:
        # If JWT token is provided, get user profile (simplified for demo)
        user_profile = {}
        if request.jwt_token:
            # In a real implementation, you'd validate the token and extract user data
            # For now, we'll just decode it without validation for demo purposes
            import jwt
            try:
                decoded = jwt.decode(
                    request.jwt_token,
                    os.getenv("AUTH_SECRET", "fallback_secret_for_development"),
                    algorithms=["HS256"]
                )
                # In a real app, you'd fetch user profile from DB using the user ID
                # Here we'll use placeholder values
                user_profile = {
                    "skill_level": decoded.get("skill_level", "intermediate"),
                    "hardware_experience": decoded.get("hardware_experience", "some experience"),
                    "software_experience": decoded.get("software_experience", "some experience"),
                    "programming_level": decoded.get("programming_level", "intermediate"),
                    "preferred_learning_style": decoded.get("preferred_learning_style", "visual"),
                    "preferred_language": decoded.get("preferred_language", "en")
                }
            except jwt.InvalidTokenError:
                # If token is invalid, continue without personalization
                user_profile = {}

        # Personalize the content using the agent with caching
        personalized_content = personalization_agent.personalize_content(
            request.raw_md,
            user_profile,
            request.chapter_path
        )

        # Check if the content was retrieved from cache by checking cache stats before and after
        cache_stats = personalization_agent.get_cache_stats()
        cached = cache_stats.get("valid_entries", 0) > 0  # Simplified cache status check

        # Performance monitoring
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        logger.info(f"Personalization completed in {duration:.2f}s for chapter: {request.chapter_path}")

        if duration > 10:
            logger.warning(f"Personalization took {duration:.2f}s (over 10s limit)")

        return PersonalizeResponse(
            personalized_md=personalized_content,
            cached=cached
        )
    except Exception as e:
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        logger.error(f"Personalization failed after {duration:.2f}s: {str(e)}")
        print("\n--- ERROR IN PERSONALIZATION ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Pydantic model for user profile request
class UserProfileRequest(BaseModel):
    jwt_token: str

class UserProfileResponse(BaseModel):
    user_id: str
    email: str
    profile: dict

# --- User profile endpoint ---
@app.get("/profile/me", response_model=UserProfileResponse)
async def get_user_profile(token: str = Depends(token_auth_scheme)):
    try:
        # The token has already been validated by the middleware
        # In a real implementation, you'd fetch the user profile from the database
        # Here we'll return a placeholder response
        import jwt
        decoded = jwt.decode(
            token,
            os.getenv("AUTH_SECRET", "fallback_secret_for_development"),
            algorithms=["HS256"]
        )

        return UserProfileResponse(
            user_id=decoded.get("userId", ""),
            email=decoded.get("email", ""),
            profile={
                "skill_level": decoded.get("skill_level", "intermediate"),
                "hardware_experience": decoded.get("hardware_experience", "some experience"),
                "software_experience": decoded.get("software_experience", "some experience"),
                "programming_level": decoded.get("programming_level", "intermediate"),
                "preferred_learning_style": decoded.get("preferred_learning_style", "visual"),
                "preferred_language": decoded.get("preferred_language", "en")
            }
        )
    except Exception as e:
        print("\n--- ERROR GETTING USER PROFILE ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# Pydantic model for translation request
class TranslationRequest(BaseModel):
    chapter_path: str = ""
    raw_md: str = ""
    selected_text: str = ""
    target_language: str = "ur"
    jwt_token: str = ""

class TranslationResponse(BaseModel):
    translated_md: str

# --- Translation endpoint ---
@app.post("/translate", response_model=TranslationResponse)
async def translate_content(request: TranslationRequest):
    start_time = asyncio.get_event_loop().time()
    try:
        # Determine what to translate: selected text takes priority over full chapter content
        content_to_translate = request.selected_text if request.selected_text else request.raw_md

        if not content_to_translate:
            raise HTTPException(status_code=400, detail="Either raw_md or selected_text must be provided")

        # Get user profile if JWT token is provided to determine preferred language
        user_preferred_language = request.target_language
        if request.jwt_token:
            import jwt
            try:
                decoded = jwt.decode(
                    request.jwt_token,
                    os.getenv("AUTH_SECRET", "fallback_secret_for_development"),
                    algorithms=["HS256"]
                )
                # Use user's preferred language from profile if not explicitly specified
                if request.target_language == "ur":  # Only override if default
                    user_preferred_language = decoded.get("preferred_language", "ur")
            except jwt.InvalidTokenError:
                pass  # Use default language if token is invalid

        # Translate the content using the agent
        translated_content = await translation_agent.translate_content(
            content_to_translate,
            user_preferred_language
        )

        # Performance monitoring
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        logger.info(f"Translation completed in {duration:.2f}s to {request.target_language}")

        if duration > 8:
            logger.warning(f"Translation took {duration:.2f}s (over 8s limit)")

        return TranslationResponse(
            translated_md=translated_content
        )
    except Exception as e:
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        logger.error(f"Translation failed after {duration:.2f}s: {str(e)}")
        print("\n--- ERROR IN TRANSLATION ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class ChatResponse(BaseModel):
    answer: str
    sources: list = []

# --- FastAPI endpoint ---
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    start_time = asyncio.get_event_loop().time()
    # print(qwen_api_key)
    try:
        print("\n--- Incoming Query ---")
        print(request.query)

        # Get user profile if JWT token is provided
        user_profile = {}
        if request.jwt_token:
            import jwt
            try:
                decoded = jwt.decode(
                    request.jwt_token,
                    os.getenv("AUTH_SECRET", "fallback_secret_for_development"),
                    algorithms=["HS256"]
                )
                # Extract user profile information
                user_profile = {
                    "skill_level": decoded.get("skill_level", "intermediate"),
                    "hardware_experience": decoded.get("hardware_experience", "some experience"),
                    "software_experience": decoded.get("software_experience", "some experience"),
                    "programming_level": decoded.get("programming_level", "intermediate"),
                    "preferred_learning_style": decoded.get("preferred_learning_style", "visual"),
                    "preferred_language": decoded.get("preferred_language", request.language)
                }
            except jwt.InvalidTokenError:
                # If token is invalid, continue without personalization
                user_profile = {}

        # Create agent with user profile for personalization
        agent = create_personalized_agent(user_profile)

        # If selection_text is provided, use it as context
        if request.selection_text:
            input_text = f"Please answer based on this selected text: {request.selection_text}\n\nQuestion: {request.query}"
        else:
            input_text = request.query

        result = await Runner.run(
            agent,
            input=input_text
        )

        print("\n--- Agent Output ---")
        print(result.final_output)

        # Performance monitoring
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        logger.info(f"Chat response completed in {duration:.2f}s")

        if duration > 3:
            logger.warning(f"Chat response took {duration:.2f}s (over 3s limit)")

        # In a real implementation, we would extract sources from the tool calls
        # For now, we return an empty array, but the infrastructure is in place
        return ChatResponse(answer=result.final_output, sources=[])

    except Exception as e:
        end_time = asyncio.get_event_loop().time()
        duration = end_time - start_time
        logger.error(f"Chat response failed after {duration:.2f}s: {str(e)}")
        print("\n--- ERROR IN AGENT ---")
        traceback.print_exc()   # <-- FULL ERROR TRACEBACK
        raise HTTPException(status_code=500, detail=str(e))



