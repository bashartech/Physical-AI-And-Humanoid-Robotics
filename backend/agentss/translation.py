from agents import Agent, Runner, OpenAIChatCompletionsModel, AsyncOpenAI, function_tool
import os
from typing import Dict, Any, Optional
import logging

# --- Setup OpenAI/Gemini Model for translation ---
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

translation_model = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash-lite",
    openai_client=provider
)

async def translate_content_tool(raw_md: str, target_language: str = "ur", preserve_formatting: bool = True) -> str:
    """
    Translate markdown content to target language while preserving formatting
    """
    try:
        # Determine the target language name for better instructions
        language_names = {
            "ur": "Urdu",
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German"
        }
        target_lang_name = language_names.get(target_language, target_language.title())

        # Construct prompt for translation with more detailed formatting instructions
        formatting_instruction = """CRITICAL: Preserve ALL markdown formatting exactly as in the original. This includes:
        - All heading levels (# ## ### etc.) with exact same hierarchy
        - All bullet points and numbered lists with exact same structure
        - All code blocks with triple backticks and language specifiers
        - All bold (**text**) and italic (*text*) formatting
        - All links [text](url) and images ![alt](url)
        - All tables with exact same structure
        - All blockquotes with > symbols
        - All horizontal rules ---
        - The exact same document structure and organization
        - Do NOT change the markdown syntax, only translate the text content""" if preserve_formatting else ""

        prompt = f"""
        TRANSLATE the following educational content to {target_lang_name}.

        {formatting_instruction}

        ***CRITICAL INSTRUCTION:*** YOU MUST OUTPUT THE TRANSLATED CONTENT IN MARKDOWN FORMAT.
        This means:
        - Headings: Use '#', '##', '###', etc.
        - Bold: Use '**' or '__' around the text.
        - Italic: Use '*' or '_' around the text.
        - Links: Use '[text](url)'.
        - Images: Use '![alt](url)'.
        - Lists: Use '-' or '*' for bullet points, '1.', '2.', etc. for numbered lists.
        - Code: Use '`' for inline code and '```' for code blocks.
        - Blockquotes: Use '>'.
        - Etc.

        PRESERVE the EXACT markdown syntax from the ORIGINAL content.
        TRANSLATE ONLY the TEXTUAL CONTENT within these markdown structures.
        DO NOT return the content as plain text or pure HTML.

        Content to translate:
        {raw_md}

        CRITICAL TRANSLATION RULES:
        1. Output format: MARKDOWN.
        2. Translate ONLY the text content within markdown elements, PRESERVE the markdown syntax exactly.
        3. Keep headings (# ## ###) with same levels and order.
        4. Keep lists (bullet/numbered) with same structure.
        5. Keep code blocks with same language specifiers.
        6. Maintain the same document organization and flow.
        7. If target language is Urdu, use Arabic script.
        8. Do not add, remove, or reorder sections - only translate text.
        9. Maintain all technical terminology appropriately in context.
        10. Ensure the translated content has the same readability and structure as the original.
        """

        # Create a translation agent
        translation_agent = Agent(
            name="TranslationAssistant",
            instructions=f"""You are an expert educational content translator.
            Your task is to translate content to {target_lang_name} while preserving ALL markdown formatting exactly.
            Translate the text content but keep all markdown syntax (headings, lists, code, etc.) unchanged.
            Maintain the same structure, hierarchy, and organization as the original document.""",
            model=translation_model,
        )

        # Run the translation
        result = await Runner.run(
            translation_agent,
            input=prompt
        )

        final_output = result.final_output
        # DEBUG: Log the raw output from the AI
        print(f"DEBUG: Raw AI output for {target_language}:\n{final_output}\n---END OUTPUT---")
        logging.info(f"Raw AI output length for {target_language}: {len(final_output)}")

        return final_output
    except Exception as e:
        logging.error(f"Error in translation for {target_language}: {e}")
        # DEBUG: Log the original content being returned as fallback
        print(f"DEBUG: Translation failed for {target_language}, returning original content.")
        # Return original content if translation fails
        return raw_md

class TranslationAgent:
    def __init__(self):
        self.supported_languages = {
            "ur": "Urdu",
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German"
        }

    async def translate_content(self, raw_md: str, target_language: str = "ur", user_profile: Optional[Dict[str, Any]] = None) -> str:
        """
        Translate markdown content to target language
        """
        try:
            # Validate language
            if target_language not in self.supported_languages:
                raise ValueError(f"Unsupported language: {target_language}. Supported languages: {list(self.supported_languages.keys())}")

            # Use the tool to translate content
            translated_content = await translate_content_tool(raw_md, target_language)

            return translated_content
        except Exception as e:
            logging.error(f"Error in translation: {e}")
            # Return original content if translation fails
            return raw_md

    async def translate_selected_text(self, selected_text: str, target_language: str = "ur") -> str:
        """
        Translate selected text to target language
        """
        try:
            # Validate language
            if target_language not in self.supported_languages:
                raise ValueError(f"Unsupported language: {target_language}. Supported languages: {list(self.supported_languages.keys())}")

            # Use the tool to translate content
            translated_content = await translate_content_tool(selected_text, target_language, preserve_formatting=False)

            return translated_content
        except Exception as e:
            logging.error(f"Error in selected text translation: {e}")
            # Return original content if translation fails
            return selected_text

# Create a global instance
translation_agent = TranslationAgent()