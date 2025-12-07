# RAG Chatbot Demo Script (Max 90 seconds)

This script outlines a quick demonstration of the RAG Chatbot's core functionalities.

## Setup (Pre-requisites)

1.  **Backend Running**: Ensure the FastAPI backend is running (e.g., `uvicorn backend.main:app --reload`).
2.  **Frontend Running**: Ensure the Docusaurus frontend is running (e.g., `npm start` in `frontend/`).
3.  **Qdrant Running**: Ensure Qdrant is accessible (e.g., `docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant`).
4.  **Environment Variables**: `.env` in `backend/` is configured correctly (e.g., `NEON_DATABASE_URL`, `OPENAI_API_KEY`, `QDRANT_COLLECTION`).
5.  **Ingested Content**: The book content has been ingested into Qdrant (can be done via `/ingest` API endpoint).

## Demo Steps (Focus: User Experience)

*(Total Time: ~90 seconds)*

1.  **Show Frontend Landing Page (5s)**
    *   Briefly show the Docusaurus book landing page.

2.  **General RAG Query (20s)**
    *   Open the chat widget.
    *   Ask a general question related to the book content (e.g., "What are the main types of humanoid robots discussed?").
    *   Demonstrate the chatbot providing an answer with **citations**.
    *   **(Optional)** Click on a citation link to show navigation to the source document and highlight the chunk.

3.  **Selected-Text-Only Chat (20s)**
    *   Navigate to a specific page/section in the book.
    *   **Select a paragraph of text** on the page.
    *   Observe the "Ask about selection" popup appearing.
    *   Click "Ask about selection" to open the chat widget with the selected text pre-filled and the "Answer constrained..." badge visible.
    *   Ask a question directly related to the *selected text* (e.g., "What is the key takeaway from this paragraph?").
    *   Demonstrate the chatbot answering *only* from the selected text, or stating if it doesn't have enough information.

4.  **Logging Confirmation (15s)**
    *   Briefly show the backend logs (console output or a database client if accessible) to indicate that both queries (general and selected-text) were logged.

5.  **Wrap-up (5s)**
    *   Conclude by highlighting the chatbot's ability to provide contextual, cited answers from the book, both generally and with specific selections.

## Success Criteria Covered

*   US1: Ingest Book Content (Demonstrated by available content for queries)
*   US2: General RAG Chat (Step 2)
*   US3: Selected-Text-Only Chat (Step 3)
*   US4: Citation and Source Linking (Step 2 - optional click, but visible citations)
*   Phase 7: Query Logging (Step 4)
