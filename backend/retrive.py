import os
from qdrant_client import QdrantClient
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

# Load same model as ingestion
model = SentenceTransformer("all-MiniLM-L6-v2")

# Connect to Qdrant
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

def get_embedding(text):
    return model.encode([text])[0].tolist()

def retrieve(query):
    embedding = get_embedding(query)
    result = qdrant.query_points(
        collection_name="RoboBook",
        query=embedding,
        limit=5
    )
    return [p.payload["text"] for p in result.points]

print(retrieve("What data do you have?"))
