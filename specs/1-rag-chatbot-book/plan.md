# Implementation Plan: RAG Chatbot for "Physical AI & Humanoid Robotics"

**Branch**: `1-rag-chatbot-book` | **Date**: 2025-12-05 | **Spec**: [specs/1-rag-chatbot-book/spec.md](specs/1-rag-chatbot-book/spec.md)
**Input**: Feature specification from `/specs/1-rag-chatbot-book/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan details the implementation of a Retrieval-Augmented Generation (RAG) chatbot for the "Physical AI & Humanoid Robotics" textbook. The chatbot will be integrated into the Docusaurus book UI, powered by a FastAPI backend, OpenAI Agents SDK, and Qdrant Cloud. Key functionalities include ingesting book content into Qdrant, processing user queries, providing precise, cited answers, and enforcing a strict "Selected-Text-Only" mode when applicable. The technical approach involves leveraging Python for the backend services and JavaScript/React for the Docusaurus frontend components.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/React (frontend)
**Primary Dependencies**: FastAPI, Qdrant Client, OpenAI/Claude Embeddings/Agents SDK, Docusaurus, React
**Storage**: Qdrant (vector database), Neon Postgres (optional, for logs and user profiles)
**Testing**: Pytest (backend unit/integration), Jest/React Testing Library (frontend unit), Manual demo script (end-to-end integration)
**Target Platform**: powershell (backend deployment), Web browser (Docusaurus frontend)
**Project Type**: Web application (with distinct backend and frontend components)
**Performance Goals**: Efficient ingestion via batching embeddings/upserts, optimized retrieval using `top_k` and reranking controls, optional caching for frequent queries to enhance responsiveness.
**Constraints**: No secrets exposed in the frontend; all LLM and Qdrant calls confined to the FastAPI backend; `/api/ingest` endpoint protected with an admin key; all content must be Docusaurus-compatible Markdown; generated code must be commented and production-aware; all providers must be environment-configured, no hardcoded secrets.
**Scale/Scope**: Designed to meet hackathon requirements for a comprehensive RAG chatbot, supporting interactive learning for students, researchers, and professionals. Scalability considerations include efficient data ingestion and query performance for potentially a large volume of book content and users.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The RAG Chatbot implementation aligns with the project's constitution:

-   **Modular, Layered Structure**: The architecture (Docusaurus frontend, FastAPI backend, Qdrant) supports a modular and layered design.
-   **Automated Generation**: The process of creating this plan via Claude Code aligns with automated content/workflow generation.
-   **Optimized Markdown**: The spec explicitly requires content to be optimized for Docusaurus rendering and RAG chunking.
-   **Hackathon Alignment**: The core features (book + RAG, selected-text-only) directly address hackathon requirements.
-   **Spec-Kit Plus Hierarchy**: The project follows the Spec-Kit Plus hierarchy for documentation and development artifacts.
-   **No Hallucinations**: The RAG system design strictly enforces context adherence (especially selected-text-only mode) to prevent hallucinations.
-   **Output Optimization**: Outputs (Markdown, embeddings) are optimized for Docusaurus and Qdrant.
-   **Chatbot Consumption Awareness**: The entire feature is designed with the chatbot as a primary consumption interface.
-   **Non-negotiable Compliance**: Security measures (no frontend secrets, protected endpoints) are integral to the design.

## Project Structure

### Documentation (this feature)

```text
specs/1-rag-chatbot-book/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   ├── services/          # Qdrant client, embeddings, agent orchestrator, optional db
│   └── api/               # FastAPI routes (query, ingest)
└── tests/

frontend/
├── src/
│   ├── components/        # ChatWidget.tsx, SelectionPopup.tsx
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: The project will utilize a web application structure with distinct `backend/` and `frontend/` directories, as outlined in the feature specification. This separation supports modular development and clear separation of concerns.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |
