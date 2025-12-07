# import os
# import argparse
# import frontmatter
# import markdown
# from bs4 import BeautifulSoup
# from typing import List, Dict, Any, Tuple
# from dotenv import load_dotenv
# import json
# import uuid

# # Load environment variables
# load_dotenv(override=True)

# from backend.src.services.qdrant_client import get_qdrant_client, create_collection, upsert_vectors
# from backend.src.services.embeddings import embed_texts, EMBED_DIM
# from qdrant_client import models

# QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION")
# SOURCE_DOCS_DIR = os.getenv("SOURCE_DOCS_DIR")
# CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
# CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# def get_files_recursively(directory: str, extensions: Tuple[str, ...] = (".md", ".mdx")) -> List[str]:
#     file_paths = []
#     for root, _, files in os.walk(directory):
#         for file in files:
#             if file.endswith(extensions):
#                 file_paths.append(os.path.join(root, file))
#     return file_paths

# def parse_markdown_file(file_path: str) -> Tuple[Dict[str, Any], str]:
#     with open(file_path, "r", encoding="utf-8") as f:
#         post = frontmatter.load(f)
#     return post.metadata, post.content

# def chunk_text(text: str, chunk_size: int, chunk_overlap: int) -> List[str]:
#     # TODO: Implement token-aware chunking using a tokenizer for the target LLM/embedder.
#     # For now, this is a simple character-based chunking as a fallback.
#     chunks = []
#     start = 0
#     while start < len(text):
#         end = start + chunk_size
#         chunk = text[start:end]
#         chunks.append(chunk)
#         start += (chunk_size - chunk_overlap)
#         if start > len(text): # Ensure not to go past the end of the text
#             start = len(text)
#     return chunks

# def generate_chunks_with_metadata(file_path: str, metadata: Dict[str, Any], content: str) -> List[Dict[str, Any]]:
#     chunks_data = []
#     raw_chunks = chunk_text(content, CHUNK_SIZE, CHUNK_OVERLAP)

#     base_dir = os.path.normpath(SOURCE_DOCS_DIR)
#     rel_path = os.path.normpath(os.path.relpath(file_path, base_dir))

#     for i, chunk_text_content in enumerate(raw_chunks):
#         # Simple char offset for now, improve with real tokenizer later
#         char_start = content.find(chunk_text_content)
#         char_end = char_start + len(chunk_text_content)
#         point_id = str(uuid.uuid4()) # Generate unique ID for Qdrant

#         chunk_metadata = {
#             "source_path": rel_path,
#             "module": metadata.get("module"),
#             "chapter": metadata.get("chapter"),
#             "chunk_index": i,
#             "char_start": char_start,
#             "char_end": char_end,
#             "text_preview": chunk_text_content[:400], # First 400 chars as preview
#             "language": "en", # Assuming English for now
#             "anchor": f"{os.path.splitext(rel_path)[0].replace(os.sep, '-')}-chunk-{i}",
#             "qdrant_point_id": point_id # Store point ID in metadata
#         }
#         chunks_data.append({"text": chunk_text_content, "metadata": chunk_metadata, "id": point_id}) # Also store ID with chunk data
#     return chunks_data

# def run_ingestion(dry_run: bool = False, create_collection: bool = False, batch_size: int = 64, provider: str = os.getenv("EMBEDDING_PROVIDER", "openai")) -> Dict[str, Any]:
#     if not SOURCE_DOCS_DIR or not QDRANT_COLLECTION:
#         raise ValueError("SOURCE_DOCS_DIR or QDRANT_COLLECTION environment variables not set.")

#     qdrant_client = get_qdrant_client()

#     if create_collection:
#         print(f"Recreating collection '{QDRANT_COLLECTION}'...")
#         create_collection(QDRANT_COLLECTION, EMBED_DIM, models.Distance.COSINE)
#         print("Collection recreated.")

#     file_paths = get_files_recursively(SOURCE_DOCS_DIR)
#     all_chunks_data = []

#     print(f"Found {len(file_paths)} markdown files in {SOURCE_DOCS_DIR}")

#     for file_path in file_paths:
#         metadata, content = parse_markdown_file(file_path)
#         chunks = generate_chunks_with_metadata(file_path, metadata, content)
#         all_chunks_data.extend(chunks)

#     print(f"Generated {len(all_chunks_data)} chunks.")

#     if dry_run:
#         print("Dry run complete. No data upserted.")
#         for i, chunk_data in enumerate(all_chunks_data[:5]):
#             print(f"\n--- Chunk {i+1} ---")
#             print(f"Text Preview: {chunk_data['text'][:200]}...")
#             print(f"Metadata: {chunk_data['metadata']}")
#         return {"files_processed": len(file_paths), "chunks_upserted": len(all_chunks_data), "collection_name": QDRANT_COLLECTION}

#     vectors_to_upsert = []
#     payloads_to_upsert = []
#     ids_to_upsert = [] # To store Qdrant point IDs
#     chunks_upserted = 0

#     for i in range(0, len(all_chunks_data), batch_size):
#         batch_chunks_data = all_chunks_data[i:i + batch_size]
#         texts_batch = [cd["text"] for cd in batch_chunks_data]

#         print(f"Embedding batch {i // batch_size + 1} / {len(all_chunks_data) // batch_size + 1}...")
#         embeddings_batch = embed_texts(texts_batch)

#         for j, chunk_data in enumerate(batch_chunks_data):
#             vectors_to_upsert.append(embeddings_batch[j])
#             payloads_to_upsert.append(chunk_data["metadata"])
#             ids_to_upsert.append(chunk_data["id"]) # Get the pre-generated ID

#         print(f"Upserting batch {i // batch_size + 1}...")
#         # Assuming upsert_vectors can take IDs
#         qdrant_client.upsert(
#             collection_name=QDRANT_COLLECTION,
#             wait=True,
#             points=models.Batch(
#                 ids=ids_to_upsert,
#                 vectors=vectors_to_upsert,
#                 payloads=payloads_to_upsert
#             )
#         )
#         chunks_upserted += len(vectors_to_upsert)
#         vectors_to_upsert = []
#         payloads_to_upsert = []
#         ids_to_upsert = []

#     # Generate chunk_map.json
#     chunk_map_data: Dict[str, List[Dict[str, Any]]] = {}
#     for chunk_data in all_chunks_data:
#         source_path = chunk_data["metadata"]["source_path"]
#         if source_path not in chunk_map_data:
#             chunk_map_data[source_path] = []
#         chunk_map_data[source_path].append({
#             "chunk_index": chunk_data["metadata"]["chunk_index"],
#             "anchor": chunk_data["metadata"]["anchor"],
#             "char_start": chunk_data["metadata"]["char_start"],
#             "char_end": chunk_data["metadata"]["char_end"],
#             "qdrant_point_id": chunk_data["metadata"]["qdrant_point_id"]
#         })

#     chunk_map_path = os.path.join("backend", "data", "chunk_map.json")
#     with open(chunk_map_path, "w", encoding="utf-8") as f:
#         json.dump(chunk_map_data, f, indent=2)
#     print(f"Generated chunk_map.json at {chunk_map_path}")

#     print(f"Ingestion complete. {chunks_upserted} chunks upserted to collection '{QDRANT_COLLECTION}'.")
#     return {"files_processed": len(file_paths), "chunks_upserted": chunks_upserted, "collection_name": QDRANT_COLLECTION}

# def cli_main():
#     parser = argparse.ArgumentParser(description="Ingest Markdown documents into Qdrant.")
#     parser.add_argument("--dry-run", action="store_true", help="Preview chunking and metadata without upserting to Qdrant.")
#     parser.add_argument("--create-collection", action="store_true", help="Recreate Qdrant collection before ingestion.")
#     parser.add_argument("--batch-size", type=int, default=64, help="Batch size for embedding and upsert operations.")
#     parser.add_argument("--provider", type=str, default=os.getenv("EMBEDDING_PROVIDER", "openai"), help="Embedding provider (openai or gemini).")
#     args = parser.parse_args()

#     try:
#         run_ingestion(args.dry_run, args.create_collection, args.batch_size, args.provider)
#     except ValueError as e:
#         print(f"Error: {e}")

# if __name__ == "__main__":
#     cli_main()

