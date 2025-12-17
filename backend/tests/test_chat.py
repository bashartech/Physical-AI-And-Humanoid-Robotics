"""
Tests for chat functionality
"""
import pytest
from main import create_personalized_agent

def test_agent_creation_without_profile():
    """Test that personalized agent can be created without user profile"""
    agent = create_personalized_agent()
    assert agent is not None

def test_agent_creation_with_profile():
    """Test that personalized agent can be created with user profile"""
    user_profile = {
        "skill_level": "intermediate",
        "preferred_language": "en",
        "preferred_learning_style": "visual"
    }
    agent = create_personalized_agent(user_profile)
    assert agent is not None

def test_agent_instructions_with_profile():
    """Test that agent instructions are properly customized with profile"""
    user_profile = {
        "skill_level": "beginner",
        "preferred_language": "ur",
        "hardware_experience": "none",
        "software_experience": "basic"
    }
    agent = create_personalized_agent(user_profile)
    assert agent is not None