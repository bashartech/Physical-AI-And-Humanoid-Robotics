from pydantic import BaseModel
from typing import List, Optional

class SourceMeta(BaseModel):
    source_path: str
    chunk_index: int
    score: Optional[float] = None
    anchor: Optional[str] = None

class QueryIn(BaseModel):
    question: str
    selection_text: Optional[str] = None
    user_id: Optional[str] = None
    top_k: int = 4

class QueryOut(BaseModel):
    answer: str
    sources: List[SourceMeta]
    used_selection: bool

class IngestResponse(BaseModel):
    files_processed: int
    chunks_upserted: int
    collection_name: str
