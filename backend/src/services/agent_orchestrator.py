# import os
# import re
# from typing import List, Optional, Dict, Any

# import google.generativeai as genai
# from openai import OpenAI
# from qdrant_client import models # Import models for SourceMeta conversion

# class AgentOrchestrator:
#     def __init__(self, llm_provider: str, llm_model: str, api_key: str):
#         self.llm_provider = llm_provider
#         self.llm_model = llm_model
#         self.api_key = api_key
#         self.client = self._initialize_llm_client()

#     def _initialize_llm_client(self):
#         if self.llm_provider == "openai":
#             return OpenAI(api_key=self.api_key)
#         elif self.llm_provider == "gemini":
#             genai.configure(api_key=self.api_key)
#             return genai.GenerativeModel(self.llm_model)
#         else:
#             raise ValueError(f"Unsupported LLM provider: {self.llm_provider}")


#     def _build_system_instruction(self, selection_text: Optional[str] = None) -> str:
#         instruction = (
#             "You are an assistant that must answer using ONLY the provided context blocks. "
#         )
#         if selection_text:
#             instruction += (
#                 "If 'selection_text' is provided, treat it as the only context and do NOT consult external sources. "
#             )
#         instruction += (
#             "If the context lacks the information, respond: \"I don't have enough information in the selected text to answer that.\" "
#             "Cite any facts using the format [source: path#chunk_index]. "
#             "Keep answer concise (<= 300 words) and add a 1-line next-step suggestion."
#         )
#         return instruction

#     def answer_query(self,
#                      question: str,
#                      selection_text: Optional[str] = None,
#                      user_id: Optional[str] = None,
#                      top_k: int = 4) -> Dict[str, Any]:

#         system_instruction = self._build_system_instruction(selection_text)

#         context_blocks = []
#         used_selection = False

#         if selection_text:
#             context_blocks.append({"text": selection_text, "source": "selected_text"})
#             used_selection = True
#         else:
#             from backend.src.services.qdrant_client import search_vectors
#             from backend.src.services.embeddings import embed_texts

#             query_vector = embed_texts([question])[0]
#             search_results = search_vectors(query_vector, top_k)
#             for result in search_results:
#                 # Ensure that payload keys exist before accessing
#                 source_path = result.payload.get("source_path", "unknown")
#                 chunk_index = result.payload.get("chunk_index", 0)
#                 context_blocks.append({
#                     "text": result.payload.get("text_preview", ""),
#                     "source": f"{source_path}#chunk_{chunk_index}"
#                 })

#         # Placeholder for agent/chat completion call
#         print(f"Calling LLM ({self.llm_model}) with instruction: {system_instruction}")
#         print(f"Context: {context_blocks}")
#         print(f"Question: {question}")

#         messages = []
#         # Add system instruction
#         if self.llm_provider == "openai":
#             messages.append({"role": "system", "content": system_instruction})
#         else: # Gemini
#             # Gemini models may not directly support a 'system' role.
#             # Prepend system instruction to the first user message or handle differently.
#             # For simplicity, we'll include it with the user message or context for now.
#             pass

#         # Add context blocks
#         for block in context_blocks:
#             messages.append({"role": "user", "content": f"Context from {block['source']}:\n{block['text']}"})

#         # Add the actual question
#         messages.append({"role": "user", "content": question})

#         answer_text = ""
#         source_references = []

#         if self.llm_provider == "openai":
#             try:
#                 response = self.client.chat.completions.create(
#                     model=self.llm_model,
#                     messages=messages,
#                     max_tokens=500 # Adjust as needed
#                 )
#                 answer_text = response.choices[0].message.content
#             except Exception as e:
#                 answer_text = f"Error calling OpenAI: {str(e)}"
#                 print(answer_text)
#         elif self.llm_provider == "gemini":
#             try:
#                 # For Gemini, system instructions are often part of the prompt directly
#                 # or handled via specific API parameters.
#                 # A simple approach is to concatenate for now.
#                 full_prompt = system_instruction + "\n\n" + "\n".join([msg["content"] for msg in messages])

#                 # Use generate_content directly as it's typically for single-turn or simple multi-turn without explicit roles if not configured.
#                 # For more complex role handling, one would use ChatSession.
#                 response = self.client.generate_content(
#                     full_prompt
#                 )
#                 answer_text = response.text
#             except Exception as e:
#                 answer_text = f"Error calling Gemini: {str(e)}"
#                 print(answer_text)
#         else:
#             answer_text = "Unsupported LLM provider."

#         # Parse sources from the answer text
#         if not used_selection: # Only parse sources if RAG was performed
#             source_pattern = re.compile(r'\[source: (.*?)#chunk_(\d+)\]')
#             parsed_sources = source_pattern.findall(answer_text)

#             for path, chunk_index in parsed_sources:
#                 source_references.append({
#                     "source_path": path,
#                     "chunk_index": int(chunk_index),
#                     "score": None, # LLM doesn't provide score directly
#                     "anchor": f"{path.replace('/', '-')}-chunk_{chunk_index}"
#                 })

#             # Remove source tags from the answer text
#             answer_text = re.sub(source_pattern, '', answer_text).strip()

#         return {
#             "answer": answer_text,
#             "sources": source_references,
#             "used_selection": used_selection
#         }
# LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini")
# LLM_MODEL = os.getenv("LLM_MODEL", "gemini-1.5-pro-latest") # Confirm actual Gemini model name
# OPENAI_API_KEY_OR_GEMINI_KEY = os.getenv("OPENAI_API_KEY_OR_GEMINI_KEY")

# agent_orchestrator = None

# def get_agent_orchestrator():
#     global agent_orchestrator
#     if agent_orchestrator is None:
#         agent_orchestrator = AgentOrchestrator(
#             llm_provider=LLM_PROVIDER,
#             llm_model=LLM_MODEL,
#             api_key=OPENAI_API_KEY_OR_GEMINI_KEY # Assuming OpenAI SDK uses this for Gemini
#         )
#     return agent_orchestrator
