# from fastapi import APIRouter, HTTPException
# from fastapi_limiter.depends import RateLimiter
# import os
# import json
# from typing import List, Dict, Any

# router = APIRouter()

# CHUNK_MAP_PATH = os.path.join("backend", "data", "chunk_map.json")

# @router.get("/sources")
# @RateLimiter(times=20, seconds=60)
# async def get_source_chunks(path: str) -> List[Dict[str, Any]]:
#     """
#     Retrieves chunk metadata for a given source path from chunk_map.json.
#     """
#     if not os.path.exists(CHUNK_MAP_PATH):
#         raise HTTPException(status_code=404, detail="chunk_map.json not found. Please run ingestion first.")

#     try:
#         with open(CHUNK_MAP_PATH, "r", encoding="utf-8") as f:
#             chunk_map = json.load(f)
#     except json.JSONDecodeError:
#         raise HTTPException(status_code=500, detail="Error decoding chunk_map.json.")

#     # Normalize the path for lookup in the chunk_map
#     normalized_path = os.path.normpath(path)

#     if normalized_path not in chunk_map:
#         raise HTTPException(status_code=404, detail=f"Source path '{path}' not found in chunk_map.")

#     return chunk_map[normalized_path]

