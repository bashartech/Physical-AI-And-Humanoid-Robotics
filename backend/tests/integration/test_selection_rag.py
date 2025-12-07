# import pytest
# from fastapi.testclient import TestClient
# from unittest.mock import patch, MagicMock
# import os

# # Adjust the path to import main and schemas correctly
# import sys
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))

# from backend.main import app
# from backend.app.models.schemas import QueryIn, QueryOut

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
# def test_selection_only_query_success(
#     mock_initialize_llm_client,
#     mock_search_vectors,
#     mock_embed_texts
# ):
#     # Ensure Qdrant related functions are not called
#     mock_embed_texts.assert_not_called()
#     mock_search_vectors.assert_not_called()

#     selected_text = "This is a specific paragraph about selected text functionality."
#     question = "What is this about?"

#     mock_llm_client_instance = MagicMock()
#     mock_initialize_llm_client.return_value = mock_llm_client_instance

#     if os.getenv("LLM_PROVIDER") == "openai":
#         mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
#             choices=[MagicMock(message=MagicMock(content="The selected text describes selected text functionality."))]
#         )
#     elif os.getenv("LLM_PROVIDER") == "gemini":
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="The selected text describes selected text functionality."
#         )
#     else:
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text="The selected text describes selected text functionality."
#         )

#     query_data = QueryIn(question=question, selection_text=selected_text)
#     response = client.post("/query", json=query_data.model_dump())

#     assert response.status_code == 200
#     response_json = response.json()
#     query_out = QueryOut(**response_json)

#     assert "describes selected text functionality" in query_out.answer
#     assert query_out.used_selection is True
#     assert len(query_out.sources) == 0


# @patch('backend.src.services.embeddings.embed_texts')
# @patch('backend.src.services.qdrant_client.search_vectors')
# @patch('backend.src.services.agent_orchestrator.AgentOrchestrator._initialize_llm_client')
# def test_selection_only_query_insufficient_info_refusal(
#     mock_initialize_llm_client,
#     mock_search_vectors,
#     mock_embed_texts
# ):
#     # Ensure Qdrant related functions are not called
#     mock_embed_texts.assert_not_called()
#     mock_search_vectors.assert_not_called()

#     selected_text = "A very short phrase."
#     question = "Elaborate on the history of the universe based on this."

#     mock_llm_client_instance = MagicMock()
#     mock_initialize_llm_client.return_value = mock_llm_client_instance

#     insufficient_info_response = "I don\'t have enough information in the selected text to answer that."

#     if os.getenv("LLM_PROVIDER") == "openai":
#         mock_llm_client_instance.chat.completions.create.return_value = MagicMock(
#             choices=[MagicMock(message=MagicMock(content=insufficient_info_response))]
#         )
#     elif os.getenv("LLM_PROVIDER") == "gemini":
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text=insufficient_info_response
#         )
#     else:
#         mock_llm_client_instance.generate_content.return_value = MagicMock(
#             text=insufficient_info_response
#         )

#     query_data = QueryIn(question=question, selection_text=selected_text)
#     response = client.post("/query", json=query_data.model_dump())

#     assert response.status_code == 200
#     response_json = response.json()
#     query_out = QueryOut(**response_json)

#     assert query_out.answer == insufficient_info_response
#     assert query_out.used_selection is True
#     assert len(query_out.sources) == 0

