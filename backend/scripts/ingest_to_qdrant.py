import os
import glob
import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# ===== Load environment variables from .env =====
load_dotenv()
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not QDRANT_URL or not QDRANT_API_KEY:
    raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in the .env file.")

# ===== CONFIG =====
COLLECTION_NAME = "RoboBook"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
TOP_K = 5
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
SOURCE_DOCS_DIR = os.path.join("data", "docs")

# ===== Load embedding model =====
print(f"Loading embedding model: {EMBEDDING_MODEL}")
model = SentenceTransformer(EMBEDDING_MODEL)
vector_size = model.get_sentence_embedding_dimension()
print(f"Vector size: {vector_size}")

# ===== Connect to Qdrant =====
print("Connecting to Qdrant...")
client = QdrantClient(url=QDRANT_URL, prefer_grpc=False, api_key=QDRANT_API_KEY)

# Create collection if it doesn't exist
try:
    collections = [col.name for col in client.get_collections().collections]
except Exception as e:
    print("Warning: Could not fetch collections. Ensure your API key has proper permissions.")
    raise e

if COLLECTION_NAME not in collections:
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
    )
    print(f"Collection created: {COLLECTION_NAME}")
else:
    print(f"Collection exists: {COLLECTION_NAME}")

# ===== Helper: split text into chunks =====
def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

# ===== Gather all markdown files recursively =====
md_files = glob.glob(os.path.join(SOURCE_DOCS_DIR, "**", "*.md"), recursive=True)
print(f"PATH: ---> {os.path.abspath(SOURCE_DOCS_DIR)}")
print(f"Found {len(md_files)} markdown files.")

if not md_files:
    raise FileNotFoundError(f"No markdown files found in {SOURCE_DOCS_DIR}")

# ===== Ingest all files =====
total_points = 0
for file_path in md_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read().strip()
        if not text:
            continue  # skip empty files

        chunks = chunk_text(text)
        embeddings = model.encode(chunks, show_progress_bar=False)

        points = [
            PointStruct(
                id=str(uuid.uuid4()),  # ✅ Use UUID to avoid Qdrant errors
                vector=embeddings[i].tolist() if hasattr(embeddings[i], "tolist") else embeddings[i],
                payload={"source": file_path, "chunk_index": i, "text": chunks[i]},
            )
            for i in range(len(chunks))
        ]

        if points:
            client.upsert(collection_name=COLLECTION_NAME, points=points)
            total_points += len(points)

    except Exception as e:
        print(f"Warning: error reading file {file_path}: {e}")

print(f"Ingestion complete. Total points uploaded: {total_points}")
print("You can now query the collection.")

# ===== Query function =====
def query_qdrant(query_text: str):
    query_embedding = model.encode([query_text])[0].tolist()
    results = client.search_points(
        collection_name=COLLECTION_NAME,
        query_vector=query_embedding,
        limit=TOP_K,
    )
    for res in results:
        print(f"Score: {res.score:.4f}, Source: {res.payload.get('source')}")
        print(f"Text chunk: {res.payload.get('text')}\n")

# ===== Interactive Query =====
while True:
    query = input("Enter your query (or 'exit' to quit): ")
    if query.lower() == "exit":
        break
    query_qdrant(query)
