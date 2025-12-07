import pytest
from unittest.mock import MagicMock, patch
from backend.src.services.embeddings import EmbeddingClient, embed_texts, get_embedding_client

@pytest.fixture
def mock_embedding_client():
    with patch('backend.src.services.embeddings.EmbeddingClient') as MockClient:
        instance = MockClient.return_value
        instance.embed_texts.return_value = [[0.2] * 1536, [0.3] * 1536] # Mock return value
        yield instance

def test_embedding_client_initialization():
    client = EmbeddingClient(api_key="test_key", model_name="test_model")
    assert client.api_key == "test_key"
    assert client.model_name == "test_model"

def test_embed_texts_mocked(mock_embedding_client):
    texts = ["text one", "text two"]
    embeddings = embed_texts(texts)

    mock_embedding_client.embed_texts.assert_called_once_with(texts)
    assert embeddings == [[0.2] * 1536, [0.3] * 1536]

def test_get_embedding_client_singleton():
    # Clear any existing singleton instance
    with patch('backend.src.services.embeddings.embedding_client', None):
        client1 = get_embedding_client()
        client2 = get_embedding_client()
        assert client1 is client2

@patch.dict(os.environ, {"EMBEDDING_PROVIDER": "openai", "OPENAI_API_KEY": "mock_openai_key"})
@patch('backend.src.services.embeddings.EmbeddingClient')
def test_get_embedding_client_openai(MockEmbeddingClient):
    # Clear any existing singleton instance
    with patch('backend.src.services.embeddings.embedding_client', None):
        client = get_embedding_client()
        MockEmbeddingClient.assert_called_once_with(api_key="mock_openai_key", model_name="text-embedding-ada-002")
        assert isinstance(client, MockEmbeddingClient)

@patch.dict(os.environ, {"EMBEDDING_PROVIDER": "gemini", "GEMINI_API_KEY": "mock_gemini_key"})
@patch('backend.src.services.embeddings.EmbeddingClient')
def test_get_embedding_client_gemini(MockEmbeddingClient):
    # Clear any existing singleton instance
    with patch('backend.src.services.embeddings.embedding_client', None):
        client = get_embedding_client()
        MockEmbeddingClient.assert_called_once_with(api_key="mock_gemini_key", model_name="text-embedding-ada-002")
        assert isinstance(client, MockEmbeddingClient)
