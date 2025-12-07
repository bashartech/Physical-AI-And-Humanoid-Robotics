# from fastapi import APIRouter, Depends, HTTPException, Header
# from fastapi_limiter.depends import RateLimiter
# import os
# from typing import Optional
# from datetime import datetime
# from sqlalchemy import Column, String, Text, DateTime, Integer
# from sqlalchemy.ext.asyncio import AsyncSession

# from backend.app.models.schemas import IngestResponse
# from backend.scripts.ingest_to_qdrant import run_ingestion
# from backend.app.services.db import get_db, Base # Import get_db and Base

# router = APIRouter()

# INGEST_ADMIN_KEY = os.getenv("INGEST_ADMIN_KEY")

# # Define the IngestLog model
# class IngestLog(Base):
#     __tablename__ = "ingest_log"
#     id = Column(Integer, primary_key=True, index=True)
#     timestamp = Column(DateTime, default=datetime.utcnow)
#     files_processed = Column(Integer, nullable=False)
#     chunks_upserted = Column(Integer, nullable=False)
#     collection_name = Column(String, nullable=False)
#     embedding_provider = Column(String, nullable=False)
#     admin_key_used = Column(Boolean, default=False)

# async def verify_admin_key(x_admin_key: Optional[str] = Header(None)):
#     if not INGEST_ADMIN_KEY:
#         # If INGEST_ADMIN_KEY is not set in .env, allow access for development simplicity
#         print("Warning: INGEST_ADMIN_KEY is not set. Ingestion endpoint is unprotected.")
#         return True
#     if x_admin_key != INGEST_ADMIN_KEY:
#         raise HTTPException(status_code=401, detail="Invalid admin key")
#     return True

# @router.post("/ingest", response_model=IngestResponse, dependencies=[Depends(verify_admin_key)])
# @RateLimiter(times=1, seconds=300)
# async def ingest_documents(batch_size: int = 64, create_collection: bool = False, db: AsyncSession = Depends(get_db)):
#     admin_key_used = False
#     if INGEST_ADMIN_KEY: # Check if admin key is configured to decide if it was used
#         # This is a simplification; a more robust check would verify the actual header
#         admin_key_used = True

#     try:
#         ingestion_result = run_ingestion(
#             dry_run=False, # This endpoint always performs actual ingestion
#             create_collection=create_collection,
#             batch_size=batch_size,
#             provider=os.getenv("EMBEDDING_PROVIDER", "openai") # Use provider from env
#         )

#         # Log the ingestion
#         log_entry = IngestLog(
#             files_processed=ingestion_result["files_processed"],
#             chunks_upserted=ingestion_result["chunks_upserted"],
#             collection_name=ingestion_result["collection_name"],
#             embedding_provider=os.getenv("EMBEDDING_PROVIDER", "openai"),
#             admin_key_used=admin_key_used
#         )
#         db.add(log_entry)
#         await db.commit()
#         await db.refresh(log_entry)

#         return IngestResponse(
#             files_processed=ingestion_result["files_processed"],
#             chunks_upserted=ingestion_result["chunks_upserted"],
#             collection_name=ingestion_result["collection_name"]
#         )
#     except ConnectionError as ce:
#         # Handle database connection errors gracefully
#         print(f"Database connection error during ingestion logging: {ce}")
#         # Proceed with ingestion response even if logging fails
#         ingestion_result = run_ingestion(
#             dry_run=False,
#             create_collection=create_collection,
#             batch_size=batch_size,
#             provider=os.getenv("EMBEDDING_PROVIDER", "openai")
#         )
#         return IngestResponse(
#             files_processed=ingestion_result["files_processed"],
#             chunks_upserted=ingestion_result["chunks_upserted"],
#             collection_name=ingestion_result["collection_name"]
#         )
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=f"Ingestion configuration error: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
