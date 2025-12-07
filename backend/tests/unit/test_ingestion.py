import pytest
from backend.scripts.ingest_to_qdrant import chunk_text

def test_chunk_text_basic():
    text = "This is a sample text for chunking. It should be split into smaller pieces."
    chunks = chunk_text(text, chunk_size=20, chunk_overlap=0)
    assert len(chunks) == 4
    assert chunks[0] == "This is a sample text"
    assert chunks[1] == " for chunking. It sh"
    assert chunks[2] == "ould be split into s"
    assert chunks[3] == "maller pieces."

def test_chunk_text_with_overlap():
    text = "abcdefghijklmnopqrstuvwxyz"
    chunks = chunk_text(text, chunk_size=10, chunk_overlap=5)
    assert len(chunks) == 4
    assert chunks[0] == "abcdefghij"
    assert chunks[1] == "fghijklmno"
    assert chunks[2] == "klmnopqrst"
    assert chunks[3] == "pqrstuvwxy"

def test_chunk_text_empty():
    text = ""
    chunks = chunk_text(text, chunk_size=10, chunk_overlap=0)
    assert len(chunks) == 0

def test_chunk_text_smaller_than_chunk_size():
    text = "short text"
    chunks = chunk_text(text, chunk_size=20, chunk_overlap=0)
    assert len(chunks) == 1
    assert chunks[0] == "short text"

def test_chunk_text_no_overlap_at_end():
    text = "This is a slightly longer text to test the end case."
    chunks = chunk_text(text, chunk_size=15, chunk_overlap=5)
    assert chunks[-1] == "end case."

def test_chunk_text_exact_fit():
    text = "abcdefghijklmnopqrst"
    chunks = chunk_text(text, chunk_size=5, chunk_overlap=0)
    assert len(chunks) == 4
    assert chunks == ["abcde", "fghij", "klmno", "pqrst"]
