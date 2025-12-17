"""
Tests for translation functionality
"""
import pytest
from agentss.translation import TranslationAgent

def test_translation_agent_creation():
    """Test that translation agent can be created"""
    agent = TranslationAgent()
    assert agent is not None
    assert "ur" in agent.supported_languages

def test_translation_functionality():
    """Test basic translation functionality"""
    agent = TranslationAgent()

    raw_content = "Hello, this is a test."
    result = agent.translate_content(raw_content, "ur")

    # The result should be a string
    assert isinstance(result, str)
    assert len(result) > 0

def test_translation_supported_languages():
    """Test that all supported languages work"""
    agent = TranslationAgent()

    raw_content = "Test content"
    for lang_code in agent.supported_languages:
        result = agent.translate_content(raw_content, lang_code)
        assert isinstance(result, str)
        assert len(result) > 0

def test_translation_with_user_profile():
    """Test translation with user profile"""
    agent = TranslationAgent()

    raw_content = "This is sample content."
    user_profile = {
        "preferred_language": "ur"
    }

    result = agent.translate_content(raw_content, "ur", user_profile)
    assert isinstance(result, str)
    assert len(result) > 0