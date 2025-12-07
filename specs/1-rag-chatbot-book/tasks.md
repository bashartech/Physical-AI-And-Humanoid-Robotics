# Development Tasks: RAG Chatbot for "Physical AI & Humanoid Robotics"

**Feature Branch**: `1-rag-chatbot-book`
**Date**: 2025-12-05
**Spec**: [specs/1-rag-chatbot-book/spec.md](specs/1-rag-chatbot-book/spec.md)
**Plan**: [specs/1-rag-chatbot-book/plan.md](specs/1-rag-chatbot-book/plan.md)

## Summary

This document outlines the detailed tasks required to implement the RAG Chatbot for the "Physical AI & Humanoid Robotics" textbook. Tasks are organized into phases: Setup, Foundational, User Stories (by priority), and Polish & Cross-Cutting Concerns. Each task includes a unique ID, priority, associated user story, and a clear file path for execution.

## Dependencies

User Stories are generally designed for independent implementation where possible, but foundational tasks must be completed first. Within each User Story phase, tasks are ordered sequentially to ensure logical flow.

-   **Phase 1: Setup** must be completed before any other phases.
-   **Phase 2: Foundational Tasks** must be completed before any User Story phases.
-   **User Story 4 (Citation and Source Linking)** depends on successful completion of User Stories 2 and 3 for full verification of citations and navigation.

## Implementation Strategy

We will adopt an MVP-first approach, prioritizing the core RAG chatbot functionality and selected-text-only mode (User Stories 1, 2, 3). Subsequent features like advanced citation linking and comprehensive logging will follow. Incremental delivery will allow for continuous testing and validation.

## Phase 1: Setup

Goal: Initialize the project structure and essential configuration files.

- [x] T001 Create `backend/` and `frontend/` base directories
- [x] T002 Create `backend/src/`, `backend/src/models/`, `backend/src/services/`, `backend/src/api/` directories
- [x] T003 Create `backend/tests/` directory
- [x] T004 Create `frontend/src/`, `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/services/` directories
- [x] T005 Create `frontend/tests/` directory
- [x] T006 Create `backend/.env.template` with required environment variables
- [x] T007 Create `backend/main.py` as initial FastAPI application entry point
- [x] T008 Initialize Docusaurus project in `frontend/` if not already present

## Phase 2: Foundational Tasks (Priority: P1)

Goal: Establish core backend services required by all chatbot functionalities.

- [x] T009 Create `backend/src/services/qdrant_client.py` for Qdrant interaction
- [x] T010 Create `backend/src/services/embeddings.py` for embedding generation
- [x] T011 Create `backend/src/services/agent_orchestrator.py` for AI agent management
- [x] T012 Create `backend/app/models/schemas.py` for API request/response schemas

## Phase 3: User Story 1 - Ingest Book Content (Priority: P1) [US1]

Goal: Enable the chatbot to ingest and process book content into Qdrant.
Independent Test: The `/api/ingest` endpoint can successfully process markdown files, upsert chunks into Qdrant with correct metadata, and return an ingestion summary.

- [x] T013 [US1] Create `backend/scripts/ingest_to_qdrant.py` for content ingestion pipeline
- [x] T014 [US1] Implement chunking logic in `backend/scripts/ingest_to_qdrant.py`
- [x] T015 [US1] Implement embedding generation in `backend/scripts/ingest_to_qdrant.py` using `embeddings.py` service
- [x] T016 [US1] Implement Qdrant upsert logic in `backend/scripts/ingest_to_qdrant.py` using `qdrant_client.py` service
- [x] T017 [US1] Create `backend/src/api/ingest.py` for the `/api/ingest` endpoint
- [x] T018 [US1] Implement admin protection for `/api/ingest` in `backend/src/api/ingest.py`
- [x] T019 [US1] Integrate ingestion script with `/api/ingest` endpoint
- [x] T020 [US1] Implement `backend/data/chunk_map.json` or database logic for anchor mapping (optional)
- [x] T021 [US1] Write unit tests for chunking logic in `backend/tests/unit/test_ingestion.py`
- [x] T022 [US1] Write unit tests for embedding function (mocked) in `backend/tests/unit/test_embeddings.py`
- [x] T023 [US1] Write unit tests for qdrant upsert wrapper (mocked) in `backend/tests/unit/test_qdrant_client.py`

## Phase 4: User Story 2 - General RAG Chat (Priority: P1) [US2]

Goal: Enable readers to ask general questions and receive accurate, cited answers.
Independent Test: A general question submitted via the frontend chat widget returns a relevant answer with clickable source links.

- [x] T024 [US2] Create `backend/src/api/query.py` for the `/api/query` endpoint
- [x] T025 [US2] Implement question embedding and Qdrant search logic in `backend/src/api/query.py` using `qdrant_client.py` and `embeddings.py`
- [x] T026 [US2] Integrate AI agent orchestration for answer generation in `backend/src/api/query.py` using `agent_orchestrator.py`
- [x] T027 [US2] Formulate strict system instructions and user prompts for general RAG queries in `backend/src/services/agent_orchestrator.py`
- [x] T028 [US2] Implement structured JSON response including `answer`, `sources`, `used_selection` in `backend/src/api/query.py`
- [x] T029 [US2] Write integration tests for end-to-end general RAG query flow in `backend/tests/integration/test_rag_query.py`

## Phase 5: User Story 3 - Selected-Text-Only Chat (Priority: P1) [US3]

Goal: Provide highly focused answers based strictly on selected text, or indicate insufficient information.
Independent Test: Selecting text and asking a question results in an answer derived ONLY from that selection, or a refusal if context is insufficient.

- [x] T030 [P] [US3] Enhance `backend/src/api/query.py` to handle `selection_text` parameter
- [x] T031 [P] [US3] Implement logic to bypass Qdrant query if `selection_text` is present in `backend/src/api/query.py`
- [x] T032 [P] [US3] Enforce agent to use ONLY `selection_text` as context in `backend/src/services/agent_orchestrator.py`
- [x] T033 [P] [US3] Implement agent response for insufficient `selection_text` ("I don’t have enough information...") in `backend/src/services/agent_orchestrator.py`
- [x] T034 [US3] Create `frontend/src/components/SelectionPopup.jsx` for text highlighting functionality
- [x] T035 [US3] Integrate `SelectionPopup.jsx` with Docusaurus pages to show "Ask about selection" button
- [x] T036 [US3] Update `frontend/src/components/ChatWidget.jsx` to pre-fill selected text and display "Answer constrained..." badge
- [x] T037 [US3] Write unit tests for `selection_text` bypass logic in `backend/tests/unit/test_query_logic.py`
- [x] T038 [US3] Write integration tests for selection-only query flow (answer/refusal) in `backend/tests/integration/test_selection_rag.py`

## Phase 6: User Story 4 - Citation and Source Linking (Priority: P2) [US4]

Goal: Display clear, clickable citations in chatbot answers that navigate to the source content.
Independent Test: Chatbot answers include formatted citations, and clicking them correctly navigates to the associated content chunk.

- [x] T039 [P] [US4] Refine `backend/src/services/agent_orchestrator.py` to ensure agent consistently includes citations (`[source: path#chunk_index]`) in answers
- [x] T040 [P] [US4] Create `backend/src/api/sources.py` for `/api/sources?path=...` endpoint (optional, if `chunk_map.json` is not directly exposed)
- [x] T041 [P] [US4] Implement logic to generate `anchor_id` during ingestion in `backend/scripts/ingest_to_qdrant.py`
- [x] T042 [US4] Update `frontend/src/components/ChatWidget.jsx` to parse and display clickable source links
- [x] T043 [US4] Implement frontend JavaScript to handle anchor navigation (`document.getElementById().scrollIntoView()`) from source links

## Phase 7: Polish & Cross-Cutting Concerns

Goal: Enhance security, observability, and finalize testing/demo preparation.

- [x] T044 Implement security measures: CORS, rate-limiting (`backend/main.py` or middleware)
- [x] T045 Create `backend/app/services/db.py` for optional Neon Postgres logging and user profiles
- [x] T046 Implement query logging in `backend/src/api/query.py` and `backend/src/api/ingest.py`
- [x] T047 Develop a manual demo script (<= 90s) covering all success criteria
- [ ] T048 Conduct comprehensive unit and integration tests across all components
- [ ] T049 Refine error handling and user feedback messages across backend and frontend
- [ ] T050 Verify that the chatbot component is present and fully integrated on the frontend book page. 
    - Check if the chatbot UI is visible on the page where users read the book.
    - Ensure the chatbot can receive user queries normally.
    - Confirm that selected text from the book page is automatically sent to the chatbot input (selected-text functionality).
    - If the chatbot is NOT present or partially integrated:
        → Create or fix the chatbot component.
        → Add it cleanly into the book page layout.
        → Ensure it communicates with the backend FastAPI + Agent SDK pipeline.
        → Ensure smooth UX so users can ask questions easily.

- [ ] T051 Audit all project files (frontend + backend) to identify missing or uninstalled 
    dependencies, packages, libraries, and tools.

    - Check package.json (frontend) for missing installs
    - Check pyproject.toml / requirements.txt (backend)
    - Check for undeclared imports that cause runtime errors
    - Verify correct environment usage:
        → Ask the user which environment is active (venv, conda, system)
        → Ensure all Python packages are installed in the correct environment
    - Install missing dependencies in the correct location
    - Remove unused or broken dependencies
    - Run final dependency health check (npm doctor, pip check)
