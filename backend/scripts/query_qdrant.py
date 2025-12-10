import os

from dotenv import load_dotenv
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

# ---------------------------
# Load environment variables
# ---------------------------
load_dotenv()
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "RoboBook")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
TOP_K = int(os.getenv("TOP_K", 5))

print("CONFIG:")
print(f" QDRANT_URL = {QDRANT_URL}")
print(f" COLLECTION_NAME = {COLLECTION_NAME}")
print(f" EMBEDDING_MODEL = {EMBEDDING_MODEL}")
print(f" TOP_K = {TOP_K}")

# ---------------------------
# Initialize embedding model
# ---------------------------
print(f"Loading embedding model: {EMBEDDING_MODEL}")
model = SentenceTransformer(EMBEDDING_MODEL)
vector_size = model.get_sentence_embedding_dimension()
print(f"Vector size: {vector_size}")

# ---------------------------
# Connect to Qdrant
# ---------------------------
print("Connecting to Qdrant...")
client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# Verify collection exists
collections = client.get_collections().collections
if any(c.name == COLLECTION_NAME for c in collections):
    print(f"Connected to collection: {COLLECTION_NAME}")
else:
    raise ValueError(
        f"Collection '{COLLECTION_NAME}' does not exist. Please run ingestion first."
    )


# ---------------------------
# Query function
# ---------------------------
def query_qdrant(query_text, top_k=TOP_K):
    query_embedding = model.encode(query_text).tolist()
    results = client.search_points(
        collection_name=COLLECTION_NAME, query_vector=query_embedding, limit=top_k
    )
    print(f"\nTop {top_k} results for query: '{query_text}'")
    if not results:
        print("No results found.")
        return

    for i, r in enumerate(results):
        print(f"{i + 1}. {r.payload['text'][:200]}... (source: {r.payload['source']})")


# ---------------------------
# Interactive query loop
# ---------------------------
if __name__ == "__main__":
    while True:
        query = input("Enter your query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break
        query_qdrant(query)
