# import pytest
# from fastapi.testclient import TestClient
# from unittest.mock import patch, MagicMock
# import os

# # Adjust the path to import main and schemas correctly
# import sys
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

# from backend.main import app
# from backend.app.models.schemas import QueryIn, QueryOut, SourceMeta

# client = TestClient(app)

# @pytest.fixture(autouse=True)
# def mock_env_vars():
#     with patch.dict(os.environ, {
#         "LLM_PROVIDER": "mock",
#         "LLM_MODEL": "mock-model",
#         "OPENAI_API_KEY_OR_GEMINI_KEY": "mock-api-key",
#         "QDRANT_URL": "http://mock-qdrant:6333",
#         "QDRANT_API_KEY": "mock-qdrant-key",
#         "QDRANT_COLLECTION": "test_collection",
#     }):
#         yield

# @patch('backend.src.services.embeddings.embed_texts')
# @patch('backend.src.services.qdrant_client.search_vectors')
# @patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
# def test_general_rag_query_success(
#     mock_initialize_llm_client,
#     mock_search_vectors,
#     mock_embed_texts
# ):
#     # Mock embeddings.py
#     mock_embed_texts.return_value = [[0.1] * 1536] # Dummy vector

#     # Mock qdrant_client.py search_vectors
#     mock_search_result = MagicMock()
#     mock_search_result.payload = {
#         "text_preview": "The quick brown fox jumps over the lazy dog.",
#         "source_path": "docs/chapter1.md",
#         "chunk_index": 0
#     }
#     mock_search_result.score = 0.98
#     mock_search_vectors.return_value = [mock_search_result]

#     # Mock LLM client (OpenAI or Gemini)
#     mock_llm_client_instance = MagicMock()
#     mock_initialize_llm_client.return_value = mock_llm_client_instance

#     # Mock the LLM response based on provider
#     if os.getenv("LLM_PROVIDER") == "openai":
#         mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
#             choices=[MagicMock(message=MagicMock(content="The fox is quick. [source: docs/chapter1.md#chunk_0]"))]
#         )
#     elif os.getenv("LLM_PROVIDER") == "gemini":
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="The fox is quick. [source: docs/chapter1.md#chunk_0]"
#         )
#     else: # Default mock for other or unknown providers
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="The fox is quick. [source: docs/chapter1.md#chunk_0]"
#         )


#     query_data = QueryIn(question="What about the fox?")
#     response = client.post("/query", json=query_data.model_dump())

#     assert response.status_code == 200
#     response_json = response.json()
#     query_out = QueryOut(**response_json)

#     assert "fox is quick" in query_out.answer.lower()
#     assert query_out.used_selection is False
#     assert len(query_out.sources) == 1
#     assert query_out.sources[0].source_path == "docs/chapter1.md"
#     assert query_out.sources[0].chunk_index == 0
#     assert query_out.sources[0].anchor == "docs-chapter1.md-chunk_0"

#     mock_embed_texts.assert_called_once_with([query_data.question])
#     mock_search_vectors.assert_called_once()


# @patch('backend.src.services.embeddings.embed_texts')
# @patch('backend.src.services.qdrant_client.search_vectors')
# @patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
# def test_general_rag_query_no_sources_if_no_rag(
#     mock_initialize_llm_client,
#     mock_search_vectors,
#     mock_embed_texts
# ):
#     # Simulate a scenario where selection_text is provided, so RAG is skipped.
#     # In this case, embed_texts and search_vectors should not be called.
#     # The LLM response should not contain [source:] tags if selection_text is used.

#     mock_embed_texts.return_value = [[0.1] * 1536] # Still mock, but shouldn't be called for coverage
#     mock_search_vectors.return_value = [] # Still mock, but shouldn't be called

#     mock_llm_client_instance = MagicMock()
#     mock_initialize_llm_client.return_value = mock_llm_client_instance

#     if os.getenv("LLM_PROVIDER") == "openai":
#         mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
#             choices=[MagicMock(message=MagicMock(content="This is an answer based on selected text."))]
#         )
#     elif os.getenv("LLM_PROVIDER") == "gemini":
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="This is an answer based on selected text."
#         )
#     else:
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="This is an answer based on selected text."
#         )

#     query_data = QueryIn(question="Explain this", selection_text="This is some selected text.")
#     response = client.post("/query", json=query_data.model_dump())

#     assert response.status_code == 200
#     response_json = response.json()
#     query_out = QueryOut(**response_json)

#     assert "answer based on selected text" in query_out.answer.lower()
#     assert query_out.used_selection is True
#     assert len(query_out.sources) == 0 # No sources when selection_text is used

#     mock_embed_texts.assert_not_called()
#     mock_search_vectors.assert_not_called()

# @patch('backend.src.services.embeddings.embed_texts')
# @patch('backend.src.services.qdrant_client.search_vectors')
# @patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
# def test_general_rag_query_no_context_available(
#     mock_initialize_llm_client,
#     mock_search_vectors,
#     mock_embed_texts
# ):
#     # Mock that no relevant documents are found
#     mock_embed_texts.return_value = [[0.1] * 1536]
#     mock_search_vectors.return_value = [] # No search results

#     mock_llm_client_instance = MagicMock()
#     mock_initialize_llm_client.return_value = mock_llm_client_instance

#     if os.getenv("LLM_PROVIDER") == "openai":
#         mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
#             choices=[MagicMock(message=MagicMock(content="I don't have enough information in the selected text to answer that."))]
#         )
#     elif os.getenv("LLM_PROVIDER") == "gemini":
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="I don't have enough information in the selected text to answer that."
#         )
#     else:
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="I don't have enough information in the selected text to answer that."
#         )

#     query_data = QueryIn(question="Tell me about something unknown.")
#     response = client.post("/query", json=query_data.model_dump())

#     assert response.status_code == 200
#     response_json = response.json()
#     query_out = QueryOut(**response_json)

#     assert "I don't have enough information" in query_out.answer
#     assert query_out.used_selection is False
#     assert len(query_out.sources) == 0

#     mock_embed_texts.assert_called_once_with([query_data.question])
#     mock_search_vectors.assert_called_once()


# @patch('backend.src.services.embeddings.embed_texts')
# @patch('backend.src.services.qdrant_client.search_vectors')
# @patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
# def test_general_rag_query_llm_error_handling(
#     mock_initialize_llm_client,
#     mock_search_vectors,
#     mock_embed_texts
# ):
#     mock_embed_texts.return_value = [[0.1] * 1536]
#     mock_search_vectors.return_value = []

#     mock_llm_client_instance = MagicMock()
#     mock_initialize_llm_client.return_value = mock_llm_client_instance

#     # Simulate an error from the LLM client
#     if os.getenv("LLM_PROVIDER") == "openai":
#         mock_llm_client_instance.chat.completions.create.side_effect = Exception("OpenAI API error")
#     elif os.getenv("LLM_PROVIDER") == "gemini":
#         mock_llm_client_instance.generate_content.side_effect = Exception("Gemini API error")
#     else:
#         mock_llm_client_instance.generate_content.side_effect = Exception("Mock LLM API error")

#     query_data = QueryIn(question="This should trigger an error.")
#     response = client.post("/query", json=query_data.model_dump())

#     assert response.status_code == 200 # The orchestrator handles the error gracefully
#     response_json = response.json()
#     query_out = QueryOut(**response_json)

#     assert "Error calling" in query_out.answer
#     assert query_out.used_selection is False
#     assert len(query_out.sources) == 0

#     mock_embed_texts.assert_called_once()
#     mock_search_vectors.assert_called_once()
