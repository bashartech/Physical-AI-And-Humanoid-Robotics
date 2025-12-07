# from fastapi import APIRouter, HTTPException, Depends
# from typing import Optional
# from datetime import datetime
# from sqlalchemy import Column, String, Text, DateTime, Boolean, Integer
# from sqlalchemy.ext.asyncio import AsyncSession

# from backend.app.models.schemas import QueryIn, QueryOut
# from backend.src.services.agent_orchestrator import get_agent_orchestrator
# from backend.app.services.db import get_db, Base # Import get_db and Base
# from fastapi_limiter.depends import RateLimiter

# router = APIRouter()

# # Define the QueryLog model
# class QueryLog(Base):
#     __tablename__ = "query_log"
#     id = Column(Integer, primary_key=True, index=True)
#     timestamp = Column(DateTime, default=datetime.utcnow)
#     question = Column(Text, nullable=False)
#     selection_text = Column(Text, nullable=True)
#     user_id = Column(String, nullable=True)
#     answer = Column(Text, nullable=False)
#     used_selection = Column(Boolean, nullable=False)
#     sources = Column(Text, nullable=True) # Storing sources as JSON string for simplicity
#     llm_provider = Column(String, nullable=False)
#     llm_model = Column(String, nullable=False)

# @router.post("/query", response_model=QueryOut)
# @RateLimiter(times=5, seconds=60)
# async def query_chatbot(query: QueryIn, db: AsyncSession = Depends(get_db)):
#     try:
#         orchestrator = get_agent_orchestrator()
#         result = orchestrator.answer_query(
#             question=query.question,
#             selection_text=query.selection_text,
#             user_id=query.user_id,
#             top_k=query.top_k
#         )

#         # Log the query
#         log_entry = QueryLog(
#             question=query.question,
#             selection_text=query.selection_text,
#             user_id=query.user_id,
#             answer=result["answer"],
#             used_selection=result["used_selection"],
#             sources=str(result["sources"]), # Convert list of dicts to string for logging
#             llm_provider=orchestrator.llm_provider,
#             llm_model=orchestrator.llm_model,
#         )
#         db.add(log_entry)
#         await db.commit()
#         await db.refresh(log_entry)

#         return QueryOut(**result)
#     except ConnectionError as ce:
#         # Handle database connection errors gracefully
#         print(f"Database connection error: {ce}")
#         # Proceed without logging, or return a specific error to the client if needed
#         orchestrator = get_agent_orchestrator() # Re-initialize orchestrator if db failed but query can proceed
#         result = orchestrator.answer_query(
#             question=query.question,
#             selection_text=query.selection_text,
#             user_id=query.user_id,
#             top_k=query.top_k
#         )
#         return QueryOut(**result)
#     except Exception as e:
#         print(f"Query failed: {str(e)}") # Log the error internally
#         raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
