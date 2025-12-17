"""
Tests for personalization functionality
"""
import pytest
from agentss.personalization import PersonalizationAgent

def test_personalization_agent_creation():
    """Test that personalization agent can be created"""
    agent = PersonalizationAgent()
    assert agent is not None

def test_personalization_with_profile():
    """Test personalization with user profile"""
    agent = PersonalizationAgent()

    raw_content = "This is a sample content for personalization."
    user_profile = {
        "skill_level": "beginner",
        "preferred_learning_style": "visual",
        "preferred_language": "en"
    }

    # Test that the function doesn't crash (actual personalization depends on AI model)
    result = agent.personalize_content(raw_content, user_profile)

    # At minimum, the result should be a string
    assert isinstance(result, str)
    assert len(result) > 0

def test_personalization_caching():
    """Test that caching works correctly"""
    agent = PersonalizationAgent()

    raw_content = "This is a sample content for testing caching."
    user_profile = {
        "skill_level": "intermediate",
        "preferred_learning_style": "reading",
        "preferred_language": "en"
    }

    # Call twice with same content to test caching
    result1 = agent.personalize_content(raw_content, user_profile)
    result2 = agent.personalize_content(raw_content, user_profile)

    # Both should return string content
    assert isinstance(result1, str)
    assert isinstance(result2, str)

    # Check cache stats
    stats = agent.get_cache_stats()
    assert "total_entries" in stats
    assert "valid_entries" in stats
    assert "expired_entries" in stats