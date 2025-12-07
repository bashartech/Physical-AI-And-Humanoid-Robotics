# Feature Specification: RAG Chatbot for "Physical AI & Humanoid Robotics"

**Feature Branch**: `1-rag-chatbot-book`
**Created**: 2025-12-05
**Status**: Draft
**Input**: User description: "RAG Chatbot for "Physical AI & Humanoid Robotics"  Retrieval-Augmented Chat Assistant integrated into the Docusaurus book UI, powered by OpenAI Agents SDK, FastAPI backend, and Qdrant Cloud. Define an authoritative, implementation-ready specification for the RAG chatbot required by the hackathon. The chatbot must: ingest the book content into Qdrant, accept user queries from the Docusaurus UI, use an OpenAI Agent (or Chat API) hosted behind FastAPI to retrieve context from Qdrant, and return precise, cited answers to the UI. It must also support the **Selected-Text-Only** mode: when the user selects text on a page and asks a question, the agent MUST answer *only* from that selection and explicitly refuse or state insufficient information if the answer is not contained in that text."

## Purpose
Define an authoritative, implementation-ready specification for the RAG chatbot required by the hackathon. The chatbot must: ingest the book content into Qdrant, accept user queries from the Docusaurus UI, use an OpenAI Agent (or Chat API) hosted behind FastAPI to retrieve context from Qdrant, and return precise, cited answers to the UI. It must also support the **Selected-Text-Only** mode: when the user selects text on a page and asks a question, the agent MUST answer *only* from that selection and explicitly refuse or state insufficient information if the answer is not contained in that text.

## Audience
- Hackathon judges and implementers
- Developers implementing RAG chatbots and Docusaurus integrations
- Educators using the book + chatbot for learning

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ingest Book Content (Priority: P1)

As an administrator, I want to ingest the book's markdown content into the Qdrant vector database so that the chatbot has knowledge to draw from.

**Why this priority**: This is the foundational step; without ingestion, the RAG chatbot cannot function.

**Independent Test**: The ingestion process completes successfully, and the Qdrant collection contains vectorized chunks of the book content with correct metadata.

**Acceptance Scenarios**:

1.  **Given** book markdown files exist in `backend/data/docs`, **When** the `/api/ingest` endpoint is called with proper authorization, **Then** the book content is chunked, embedded, and upserted into Qdrant, returning an ingestion summary.
2.  **Given** an ingestion process runs, **When** specific metadata (source_path, module, chapter, chunk_index, etc.) is extracted, **Then** this metadata is stored as a payload in Qdrant alongside the vector.

---

### User Story 2 - General RAG Chat (Priority: P1)

As a reader, I want to ask general questions about the book content through the Docusaurus UI and receive accurate, cited answers so that I can easily understand concepts without extensive searching.

**Why this priority**: This is a core feature for the RAG chatbot's utility, enabling broad information retrieval.

**Independent Test**: A general question is asked via the chat widget, and a relevant answer with clickable sources is displayed.

**Acceptance Scenarios**:

1.  **Given** the chat widget is open on a Docusaurus page and I type a question, **When** I submit the question without selecting text, **Then** the FastAPI backend queries Qdrant for relevant context, an AI agent formulates an answer, and the answer, along with clickable source links, is displayed in the UI.
2.  **Given** an answer is displayed with sources, **When** I click a source link, **Then** the Docusaurus page navigates to the corresponding chapter and scrolls to the cited section.

---

### User Story 3 - Selected-Text-Only Chat (Priority: P1)

As a reader, I want to select specific text on a Docusaurus page and ask a question, and receive an answer *only* based on that selection, or a clear statement if the selection is insufficient, so I can get highly focused explanations.

**Why this priority**: This is a critical hackathon requirement, demonstrating advanced context control and preventing hallucination.

**Independent Test**: Text is selected, a question is asked, and the answer strictly adheres to the selected text's content.

**Acceptance Scenarios**:

1.  **Given** I highlight text on a Docusaurus page, **When** a "Ask about selection" popup appears and I click it, then type a question that can be answered by the selected text, **Then** the chat modal opens with the selected text as context, and the AI agent provides an answer using *only* the selected text, along with a "Answer constrained to selected text" badge.
2.  **Given** I highlight text on a Docusaurus page, **When** a "Ask about selection" popup appears and I click it, then type a question that *cannot* be answered by the selected text, **Then** the AI agent responds with "I dont have enough information in the selected text to answer that."

---

### User Story 4 - Citation and Source Linking (Priority: P2)

As a reader, I want to see clear citations within chatbot answers and be able to navigate directly to the source content so I can verify information and explore further.

**Why this priority**: Essential for trust, transparency, and the educational value of the chatbot.

**Independent Test**: Chatbot answers consistently include correctly formatted citations, and clicking them leads to the right place.

**Acceptance Scenarios**:

1.  **Given** a chatbot answer contains a fact derived from the book, **When** the answer is displayed, **Then** it includes an inline citation in the format `[source: path#chunk_index]`.
2.  **Given** an ingestion process runs, **When** chunks are upserted to Qdrant, **Then** an `anchor_id` is generated and stored, allowing for direct navigation to specific sections.

---

### Edge Cases

-   **Empty Queries**: What happens when a user submits an empty question? The system should prompt the user for input.
-   **Irrelevant Queries**: How does the system handle questions completely unrelated to the book content (especially in general RAG mode)? The system should indicate it cannot answer or provide a fallback.
-   **Very Long Selection Text**: How is extremely long selected text handled (e.g., beyond typical chunk size)? The system should process it efficiently or inform the user of limitations.
-   **No Match in Qdrant**: What if Qdrant retrieval returns no relevant chunks for a general query? The agent should indicate it cannot find relevant information.
-   **Invalid Source Links**: What if a generated source link is broken or points to a non-existent anchor? The frontend should handle gracefully (e.g., log error, display plain text).

## Requirements *(mandatory)*

### Functional Requirements

-   **FR-001 (Ingestion Pipeline)**: The system MUST provide an ingestion pipeline to read Markdown/MDX files from `backend/data/docs`, extract metadata (`source_path`, `module`, `chapter`, `title`, `headers`), chunk content (token-aware with char-based fallback, configurable `CHUNK_SIZE`, `CHUNK_OVERLAP`), compute embeddings (configurable `EMBEDDING_MODEL` via env var,`GEMINI_API_KEY`), and upsert to Qdrant with a specific payload structure.
-   **FR-002 (FastAPI Service)**: The system MUST expose a FastAPI service with the following endpoints:
    -   `POST /api/ingest` (admin/protected): Triggers ingestion, returns summary.
    -   `POST /api/query`: Accepts `{ question: str, selection_text: str|null, user_id: str|null, top_k: int=4 }`, orchestrates agent, returns structured JSON `{ answer, sources, used_selection }`.
    -   `GET /api/sources?path=...` (optional): Returns chunk anchors for a given path.
-   **FR-003 (Agent Orchestration)**: The system MUST use an OpenAI Agent (or Chat API) behind FastAPI that:
    -   uses a `qdrant_retrieve` tool (if no `selection_text`) or processes inline context.
    -   enforces a strict system instruction to use only provided context or `selection_text`.
    -   returns answer + cited sources in structured JSON.
-   **FR-004 (Frontend Chat Widget)**: The Docusaurus UI MUST include a floating chat widget with:
    -   a selection popup "Ask about selection" when text is highlighted.
    -   a chat modal that pre-fills selected text and displays "Answer constrained to selected text" badge.
    -   sends `{question, selection_text?, user_id?}` to FastAPI.
    -   displays answer and clickable source links (`/<doc-path>#<anchor>`).
-   **FR-005 (Selected-Text-Only Behavior)**: If `selection_text` is present in a query, the agent MUST:
    -   NOT perform a Qdrant query.
    -   Answer using ONLY `selection_text` as context.
    -   Respond "I dont have enough information in the selected text to answer that." if `selection_text` is insufficient.
-   **FR-006 (Citations & Source Links)**: All answers MUST include source metadata in format `[source: path#chunk_index]`. The ingestion process MUST store a mapping between Qdrant point IDs and Markdown anchors.
-   **FR-007 (Security)**: The system MUST NOT expose secrets or API keys in the frontend. All LLM and Qdrant calls MUST occur in the FastAPI backend. Endpoints (e.g., `/api/ingest`) MUST be protected.
-   **FR-008 (Logging & Observability)**: The system MUST log queries (question, selection_text presence, sources, agent answer). Optionally, logs and user profiles can be stored in Neon Postgres.
-   **FR-009 (Performance)**: The system MUST use batching for ingestion/upserts and leverage `top_k`/reranking for retrieval. Optional caching for frequent queries.

### Key Entities

-   **Book Content Chunk**: A segment of book text with metadata (source_path, module, chapter, title, headers, chunk_index, char_start, char_end, text_preview, language) and an associated embedding vector. Stored in Qdrant.
-   **User Query**: Input from the frontend, consisting of a question, optional selected text (`selection_text`), and an optional user identifier (`user_id`).
-   **Chatbot Answer**: Structured JSON output from the AI agent, containing the generated `answer_text`, an array of `source_references` (path, chunk_index, score, anchor), and a boolean `used_selection`.
-   **Source Reference**: Metadata linking a part of the answer to its origin in the book, including `source_path`, `chunk_index`, `score`, and `anchor`.
-   **Chunk Map**: An optional mapping (JSON file or DB table) linking Qdrant point IDs to Markdown anchors for frontend navigation.
-   **Log Entry**: Record of a chatbot interaction, including query details, response details, timestamp, and user information.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001**: The ingestion script successfully upserts all book chunks (expected: 100%) to Qdrant with complete metadata.
-   **SC-002**: The `/api/query` endpoint consistently returns correct answers (qualitative) and includes accurate source metadata for 95% of relevant queries.
-   **SC-003**: Selection-only queries are strictly constrained to the `selection_text` (qualitative verification) and correctly refuse to answer when insufficient context is provided (100% accuracy).
-   **SC-004**: The chat widget displays answers and clickable sources correctly, and anchor navigation functions for 100% of valid source links.
-   **SC-005**: All sensitive API keys and secrets are exclusively configured in the backend environment variables, with no client-side exposure.
-   **SC-006**: A demo video (<= 90s) clearly showcases the selection-only capability and general RAG answers, demonstrating the core functionality.

## Constraints & Non-Goals

-   **Non-goal**: Building a full analytics dashboard (only logs + CSV export).
-   **Non-goal**: Production-level rate-limiting infrastructure (simple per-IP or per-user is sufficient).
-   **Constraint**: This spec assumes a single language (English) primary content; Urdu support is optional and deferred to personalization/translation features.
-   **Constraint**: Files must be Docusaurus-compatible (MDX-safe Markdown left intact).
-   **Constraint**: All generated code must be commented and production-aware.
-   **Constraint**: Use only environment-configured providers and do not hardcode secrets.

## Assumptions

-   `backend/.env` contains Qdrant connection values: `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION`, `SOURCE_DOCS_DIR`, `CHUNK_SIZE`, `CHUNK_OVERLAP`.
-   Docusaurus frontend exists in `frontend/` and the book markdown files are in `backend/data/docs` (or `docs/` path).
-   You have access to Gemini API keys etc stored in `.env`.
-   Better-Auth / Neon integration is optional (recommended for personalization).
-   The embedding dimension for Qdrant `vectors_config` can be read from the embedding API or set in an environment variable.
-   The distance metric (COSINE or DOT) for Qdrant can be configured based on the embedding model.

## Deliverables

1.  `backend/scripts/ingest_to_qdrant.py` (production-ready, configurable)
2.  FastAPI app scaffold with `routes/query.py` and `routes/ingest.py`
3.  Agent prompt & tool definitions (system instruction, prompt wrapper)
4.  `frontend/src/components/ChatWidget.jsx` and `SelectionPopup.jsx` and CSS
5.  `backend/data/chunk_map.json` or DB table mapping
6.  Example `.env.template` listing required env keys: `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION`, `OPENAI_API_KEY`, `EMBEDDING_MODEL`, `LLM_MODEL`, `NEON_DATABASE_URL` (optional), `INGEST_ADMIN_KEY`, `BASE_URL`
7.  Test plan and demo script
