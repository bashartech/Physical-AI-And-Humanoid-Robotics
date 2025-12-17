from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI, function_tool
import os
from typing import Dict, Any, Optional
import logging

# --- Setup OpenAI/Gemini Model for personalization ---
gemini_api_key = os.getenv("GEMINI_API_KEY")
provider = AsyncOpenAI(
    api_key=gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

# qwen_api_key = os.getenv("QWEN_API_KEY")
# print(qwen_api_key)
# provider = AsyncOpenAI(
#     api_key=qwen_api_key,
#     base_url="https://portal.qwen.ai/v1/chat/completions"
# )

personalization_model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash-lite",
    openai_client=provider
)

def personalize_content_tool(raw_md: str, user_profile: Dict[str, Any]) -> str:
    """
    Personalize markdown content based on user profile using the agents framework
    """
    try:
        # Construct prompt for personalization
        prompt = f"""
        Personalize the following educational content based on this user profile:

        User Profile:
        - Skill Level: {user_profile.get('skill_level', 'Not specified')}
        - Hardware Experience: {user_profile.get('hardware_experience', 'Not specified')}
        - Software Experience: {user_profile.get('software_experience', 'Not specified')}
        - Programming Level: {user_profile.get('programming_level', 'Not specified')}
        - Preferred Learning Style: {user_profile.get('preferred_learning_style', 'Not specified')}
        - Preferred Language: {user_profile.get('preferred_language', 'en')}

        Content to personalize:
        {raw_md}

        Instructions:
        1. Adapt examples and explanations to match the user's experience level
        2. Adjust complexity based on skill level (beginner/intermediate/advanced)
        3. Include relevant examples based on hardware/software experience
        4. Format content according to preferred learning style (visual, auditory, reading, kinesthetic)
        5. Preserve all markdown formatting (headings, code blocks, lists, links, etc.)
        6. Keep the educational value and accuracy of the content intact
        7. Make the content more relatable and engaging for the user
        """

        # Create a personalization agent
        personalization_agent = Agent(
            name="PersonalizationAssistant",
            instructions="""You are an AI assistant that personalizes educational content based on user profiles.
            Your task is to adapt educational content to match the user's skill level, learning style, and background.
            Preserve all markdown formatting including headings, code blocks, lists, and links.
            Only modify the content to make it more relevant to the user's profile.""",
            model=personalization_model,
        )

        # Run the personalization
        result = Runner.run(
            personalization_agent,
            input=prompt
        )

        return result.final_output
    except Exception as e:
        logging.error(f"Error in personalization: {e}")
        # Return original content if personalization fails
        return raw_md

import time
from typing import Tuple

class CacheEntry:
    def __init__(self, content: str, expiry_time: float):
        self.content = content
        self.expiry_time = expiry_time

class PersonalizationAgent:
    def __init__(self):
        self.cache = {}  # Simple in-memory cache with TTL support

    def _generate_cache_key(self, raw_md: str, user_profile: Dict[str, Any], chapter_path: str = "") -> str:
        """Generate a unique cache key based on content, user profile, and chapter path"""
        profile_str = str(sorted(user_profile.items()))
        combined_str = f"{raw_md}_{profile_str}_{chapter_path}"
        return str(hash(combined_str))

    def _is_cache_valid(self, cache_entry: CacheEntry) -> bool:
        """Check if cache entry is still valid (not expired)"""
        return time.time() < cache_entry.expiry_time

    def personalize_content(self, raw_md: str, user_profile: Dict[str, Any], chapter_path: str = "", cache_ttl: int = 3600) -> str:
        """
        Personalize markdown content based on user profile with caching
        """
        # Create cache key
        cache_key = self._generate_cache_key(raw_md, user_profile, chapter_path)

        # Check cache first
        if cache_key in self.cache:
            cache_entry = self.cache[cache_key]
            if self._is_cache_valid(cache_entry):
                print(f"Cache hit for key: {cache_key[:16]}...")
                return cache_entry.content
            else:
                # Remove expired entry
                del self.cache[cache_key]

        try:
            print(f"Cache miss, generating personalized content for key: {cache_key[:16]}...")
            # Use the tool to personalize content
            personalized_content = personalize_content_tool(raw_md, user_profile)

            # Cache the result with TTL (default 1 hour)
            expiry_time = time.time() + cache_ttl
            cache_entry = CacheEntry(personalized_content, expiry_time)
            self.cache[cache_key] = cache_entry

            return personalized_content
        except Exception as e:
            logging.error(f"Error in personalization: {e}")
            # Return original content if personalization fails
            return raw_md

    def clear_cache(self):
        """Clear the cache"""
        self.cache.clear()

    def set_cache_ttl(self, chapter_path: str, personalized_content: str, ttl_minutes: int = 60):
        """Set TTL for cached content (simplified implementation)"""
        # This method is for compatibility but TTL is now handled automatically
        # In a real implementation, you'd use a proper caching system with TTL
        pass

    def get_cache_stats(self) -> Dict[str, int]:
        """Get cache statistics"""
        valid_entries = 0
        expired_entries = 0

        current_time = time.time()
        for cache_entry in self.cache.values():
            if self._is_cache_valid(cache_entry):
                valid_entries += 1
            else:
                expired_entries += 1

        return {
            "total_entries": len(self.cache),
            "valid_entries": valid_entries,
            "expired_entries": expired_entries
        }

# Create a global instance
personalization_agent = PersonalizationAgent()