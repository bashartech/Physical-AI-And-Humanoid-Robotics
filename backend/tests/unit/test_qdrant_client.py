import pytest
from unittest.mock import MagicMock, patch
from qdrant_client import models

# Mock the QdrantClient itself
@pytest.fixture
def mock_qdrant_client_instance():
    with patch('backend.src.services.qdrant_client.QdrantClient') as MockQdrantClient:
        instance = MockQdrantClient.return_value
        yield instance

# Mock the get_qdrant_client function to return our mocked instance
@pytest.fixture
def mock_get_qdrant_client(mock_qdrant_client_instance):
    with patch('backend.src.services.qdrant_client.get_qdrant_client') as mock_func:
        mock_func.return_value = mock_qdrant_client_instance
        yield mock_func

def test_create_collection(mock_qdrant_client_instance, mock_get_qdrant_client):
    from backend.src.services.qdrant_client import create_collection

    collection_name = "test_collection"
    vector_size = 1536
    distance_metric = models.Distance.COSINE

    create_collection(collection_name, vector_size, distance_metric)

    mock_qdrant_client_instance.recreate_collection.assert_called_once_with(
        collection_name=collection_name,
        vectors_config=models.VectorParams(
            size=vector_size,
            distance=distance_metric
        ),
    )

def test_search_vectors(mock_qdrant_client_instance, mock_get_qdrant_client):
    from backend.src.services.qdrant_client import search_vectors

    query_vector = [0.1] * 1536
    top_k = 5
    mock_qdrant_client_instance.search.return_value = [models.ScoredPoint(id=1, score=0.9, payload={"text_preview": "test"}, vector=None)]

    results = search_vectors(query_vector, top_k)

    mock_qdrant_client_instance.search.assert_called_once_with(
        collection_name=os.getenv("QDRANT_COLLECTION"), # Assumes env var is set in test context
        query_vector=query_vector,
        limit=top_k,
    )
    assert len(results) == 1
    assert results[0].score == 0.9

def test_upsert_vectors(mock_qdrant_client_instance, mock_get_qdrant_client):
    from backend.src.services.qdrant_client import upsert_vectors

    vectors = [[0.1]*1536, [0.2]*1536]
    payloads = [{"text": "chunk1"}, {"text": "chunk2"}]

    upsert_vectors(vectors, payloads)

    mock_qdrant_client_instance.upsert.assert_called_once()
    called_kwargs = mock_qdrant_client_instance.upsert.call_args.kwargs

    assert called_kwargs['collection_name'] == os.getenv("QDRANT_COLLECTION")
    assert called_kwargs['wait'] == True
    points_batch = called_kwargs['points']

    assert isinstance(points_batch, models.Batch)
    assert points_batch.ids is None # In this wrapper, ids are not explicitly passed here
    assert points_batch.vectors == vectors
    assert points_batch.payloads == payloads
