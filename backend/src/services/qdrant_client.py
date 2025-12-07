# from qdrant_client import QdrantClient, models
# import os

# QDRANT_URL = os.getenv("QDRANT_URL")
# QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
# QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")

# client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)

# def get_qdrant_client():
#     return client

# def create_collection(collection_name: str, vector_size: int, distance_metric: models.Distance):
#     client.recreate_collection(
#         collection_name=collection_name,
#         vectors_config=models.VectorParams(
#             size=vector_size,
#             distance=distance_metric
#         ),
#     )

# def search_vectors(query_vector: list[float], top_k: int = 4) -> list[models.ScoredPoint]:
#     # Implement actual search logic here
#     # This is a placeholder for now
#     return client.search(
#         collection_name=QDRANT_COLLECTION,
#         query_vector=query_vector,
#         limit=top_k,
#     )

# def upsert_vectors(vectors, payloads):
#     # Implement upsert logic here
#     client.upsert(
#         collection_name=QDRANT_COLLECTION,
#         wait=True,
#         points=models.Batch(vectors=vectors, payloads=payloads)
#     )
