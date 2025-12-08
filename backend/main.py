# main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI
from agents import set_tracing_disabled, function_tool, enable_verbose_stdout_logging
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os, asyncio
import traceback 

# Load environment variables
load_dotenv()
set_tracing_disabled(disabled=True)
enable_verbose_stdout_logging()

# Initialize FastAPI
app = FastAPI(title="Physical AI Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Setup OpenAI/Gemini Model ---
gemini_api_key = os.getenv("GEMINI_API_KEYS")
print(gemini_api_key)
provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

chat_model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",
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
def retrieve(query: str):
    embedding = get_embedding(query)
    result = qdrant.query_points(
        collection_name="RoboBook",
        query=embedding,
        limit=5
    )

    print("QDRANT RAW:", result)

    texts = []
    for point in result.points:
        if "text" in point.payload:
            texts.append(point.payload["text"])
        else:
            print("⚠️ WARNING: Qdrant payload has no 'text' key:", point.payload)

    return texts


# --- Initialize Agent ---
agent = Agent(
    name="Assistant",
    instructions="""
You are an AI tutor for the Physical AI & Humanoid Robotics textbook.
To answer the user question, first call the tool `retrieve` with the user query.
Use ONLY the returned content from `retrieve` to answer.
If the answer is not in the retrieved content, say "I don't know".
""",
    model=chat_model,
    tools=[retrieve]
)

# --- Pydantic model for request ---
class ChatRequest(BaseModel):
    query: str
    selection_text: str = ""  # optional

class ChatResponse(BaseModel):
    answer: str

# --- FastAPI endpoint ---
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    print(gemini_api_key)
    try:
        print("\n--- Incoming Query ---")
        print(request.query)

        result = await Runner.run(
            agent,
            #input="what is physical ai" 
            input=request.query
            )

        print("\n--- Agent Output ---")
        print(result.final_output)

        return ChatResponse(answer=result.final_output)

    except Exception as e:
        print("\n--- ERROR IN AGENT ---")
        traceback.print_exc()   # <-- FULL ERROR TRACEBACK
        raise HTTPException(status_code=500, detail=str(e))

