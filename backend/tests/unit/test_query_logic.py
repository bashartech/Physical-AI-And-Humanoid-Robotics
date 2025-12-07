import pytest
from unittest.mock import patch, MagicMock
import os

# Adjust the path to import agent_orchestrator correctly
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

from backend.src.services.agent_orchestrator import AgentOrchestrator

@pytest.fixture
def mock_orchestrator():
    with patch.dict(os.environ, {
        "LLM_PROVIDER": "mock",
        "LLM_MODEL": "mock-model",
        "OPENAI_API_KEY_OR_GEMINI_KEY": "mock-key",
        "QDRANT_URL": "http://mock-qdrant:6333",
        "QDRANT_API_KEY": "mock-qdrant-key",
        "QDRANT_COLLECTION": "test_collection",
    }):
        # Initialize AgentOrchestrator in the patched environment
        orchestrator = AgentOrchestrator("mock", "mock-model", "mock-key")
        yield orchestrator


@patch('backend.src.services.embeddings.embed_texts')
@patch('backend.src.services.qdrant_client.search_vectors')
@patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
def test_answer_query_with_selection_text_bypasses_qdrant(
    mock_initialize_llm_client,
    mock_search_vectors,
    mock_embed_texts,
    mock_orchestrator
):
    # Simulate selected text being provided
    selection_text = "This is a selected piece of text from the document."
    question = "What is this text about?"

    # Configure mock LLM response for selection_text scenario
    mock_llm_client_instance = MagicMock()
    mock_initialize_llm_client.return_value = mock_llm_client_instance

    if os.getenv("LLM_PROVIDER") == "openai":
        mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content="The selected text is about a document piece."))]
        )
    elif os.getenv("LLM_PROVIDER") == "gemini":
        mock_llm_client_instance.generate_content.return_value = MagicMock(
            text="The selected text is about a document piece."
        )
    else:
        mock_llm_client_instance.generate_content.return_value = MagicMock(
            text="The selected text is about a document piece."
        )

    result = mock_orchestrator.answer_query(
        question=question,
        selection_text=selection_text,
        top_k=4
    )

    # Assertions
    assert result["answer"] == "The selected text is about a document piece."
    assert result["used_selection"] is True
    assert len(result["sources"]) == 0 # No sources when selection text is used

    # Verify that Qdrant-related functions were NOT called
    mock_embed_texts.assert_not_called()
    mock_search_vectors.assert_not_called()


@patch('backend.src.services.embeddings.embed_texts')
@patch('backend.src.services.qdrant_client.search_vectors')
@patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
def test_answer_query_without_selection_text_uses_qdrant(
    mock_initialize_llm_client,
    mock_search_vectors,
    mock_embed_texts,
    mock_orchestrator
):
    # Simulate no selected text, triggering Qdrant search
    question = "What is physical AI?"

    # Mock Qdrant and embedding responses
    mock_embed_texts.return_value = [[0.1] * 1536]
    mock_search_result = MagicMock()
    mock_search_result.payload = {"text_preview": "Physical AI involves embodied agents.", "source_path": "docs/ai.md", "chunk_index": 0}
    mock_search_result.score = 0.99
    mock_search_vectors.return_value = [mock_search_result]

    # Configure mock LLM response
    mock_llm_client_instance = MagicMock()
    mock_initialize_llm_client.return_value = mock_llm_client_instance

    if os.getenv("LLM_PROVIDER") == "openai":
        mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content="Physical AI involves embodied agents. [source: docs/ai.md#chunk_0]"))]
        )
    elif os.getenv("LLM_PROVIDER") == "gemini":
        mock_llm_client_instance.generate_content.return_value = MagicMock(
            text="Physical AI involves embodied agents. [source: docs/ai.md#chunk_0]"
        )
    else:
        mock_llm_client_instance.generate_content.return_value = MagicMock(
            text="Physical AI involves embodied agents. [source: docs/ai.md#chunk_0]"
        )

    result = mock_orchestrator.answer_query(
        question=question,
        selection_text=None,
        top_k=4
    )

    # Assertions
    assert "Physical AI involves embodied agents." in result["answer"]
    assert result["used_selection"] is False
    assert len(result["sources"]) == 1
    assert result["sources"][0]["source_path"] == "docs/ai.md"
    assert result["sources"][0]["chunk_index"] == 0

    # Verify that Qdrant-related functions WERE called
    mock_embed_texts.assert_called_once_with([question])
    mock_search_vectors.assert_called_once()


@patch('backend.src.services.embeddings.embed_texts')
@patch('backend.src.services.qdrant_client.search_vectors')
@patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
def test_answer_query_insufficient_selection_text_response(
    mock_initialize_llm_client,
    mock_search_vectors,
    mock_embed_texts,
    mock_orchestrator
):
    selection_text = "This is very brief text."
    question = "Explain a complex topic based on this small text."

    mock_llm_client_instance = MagicMock()
    mock_initialize_llm_client.return_value = mock_llm_client_instance

    # Simulate LLM responding with insufficient information message
    insufficient_info_response = "I don\'t have enough information in the selected text to answer that."

    if os.getenv("LLM_PROVIDER") == "openai":
        mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content=insufficient_info_response))]
        )
    elif os.getenv("LLM_PROVIDER") == "gemini":
        mock_llm_client_instance.generate_content.return_value = MagicMock(
            text=insufficient_info_response
        )
    else:
        mock_llm_client_instance.generate_content.return_value = MagicMock(
            text=insufficient_info_response
        )

    result = mock_orchestrator.answer_query(
        question=question,
        selection_text=selection_text,
        top_k=4
    )

    assert result["answer"] == insufficient_info_response
    assert result["used_selection"] is True
    assert len(result["sources"]) == 0

    mock_embed_texts.assert_not_called()
    mock_search_vectors.assert_not_called()
