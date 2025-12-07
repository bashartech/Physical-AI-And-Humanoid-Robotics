/sp.plan

Title:
Implementation Plan — RAG Chatbot for Physical AI & Humanoid Robotics (Docusaurus → FastAPI → OpenAI Agents SDK (Gemini) → Qdrant)

Overview / Goal:
Deliver a production-ready Retrieval-Augmented Generation (RAG) chatbot embedded in the Docusaurus book UI that:

Ingests the book (Markdown) into Qdrant (chunking → embeddings → upsert).

Exposes a FastAPI backend with an OpenAI Agents SDK (Gemini) orchestrator that uses a qdrant_retrieve tool for retrieval and enforces selected-text-only answers.

Serves a polished chat widget in Docusaurus that supports selection-based queries, displays answers, and links to sources (anchors).

Does not include BetterAuth in this phase (deferred). Neon/Postgres is optional and will be left out or added later per your decision.

This plan breaks the work into phases, concrete steps, decision points, tests, and deliverables. It is written for immediate execution (copy/paste into Claude Code or use as a developer checklist).

PHASES & TIMELINE (estimates for a single developer / hackathon sprint)

Phase 0 — Prep (env & repo) — 1–2 hours

Phase 1 — Ingestion pipeline (scripts + Qdrant collection) — 4–8 hours

Phase 2 — FastAPI + Agent Orchestrator (Gemini via OpenAI Agents SDK) — 6–12 hours

Phase 3 — Frontend Chat Widget (Docusaurus integration + selection UI) — 4–8 hours

Phase 4 — Integration, Testing & Demo (including selection-only tests and anchors) — 4–6 hours

Phase 5 — Polish, Documentation, CI (ingest on push) — 2–4 hours

Total: ~21–40 hours (depends on familiarity and debugging time). Adjust based on team size.

PHASE 0 — PREP (Required: do this first)

Verify /env values (you mentioned Qdrant is in backend/.env). Confirm keys present:

QDRANT_URL

QDRANT_API_KEY

QDRANT_COLLECTION

SOURCE_DOCS_DIR (e.g., backend/data/docs or docs/)

CHUNK_SIZE, CHUNK_OVERLAP

EMBEDDING_PROVIDER (e.g., openai or gemini-embeddings) — set default

LLM_PROVIDER = gemini (per your note)

OPENAI_API_KEY or GEMINI_API_KEY (whichever the OpenAI Agent SDK expects)

BASE_URL (backend URL for frontend)

INGEST_ADMIN_KEY (simple admin token for /api/ingest)

Dev tooling & requirements

Python 3.10+

Node.js 18+ (Docusaurus)

Virtualenv / pipenv / poetry for backend

Install packages: qdrant-client, openai (or OpenAI Agents SDK package that supports Gemini), fastapi, uvicorn, python-dotenv, tiktoken (if token chunking), pydantic, aiohttp (if streaming).

Repository structure (confirm/fix if missing)

/backend
  /app
    main.py
    routes/
      query.py
      ingest.py
    services/
      qdrant_client.py
      embeddings.py
      orchestrator.py
    models/
      schemas.py
  /scripts
    ingest_to_qdrant.py
    add_chunk_anchors.py
  .env
  requirements.txt
/frontend
  /src
    components/
      ChatWidget.jsx
      SelectionPopup.jsx
  package.json
  docusaurus.config.js
/docs (if applicable)


Decide embedding model & dimension

If using OpenAI embeddings: model text-embedding-3-small (1536 dim) or text-embedding-3-large.

If using Gemini embeddings (if available via OpenAI Agents SDK), decide model and confirm vector dimension.

Decision point: confirm via env variable EMBEDDING_MODEL and EMBED_DIM. This is critical for Qdrant collection configuration.

PHASE 1 — INGESTION PIPELINE (chunk → embed → upsert)

Goal: reliably convert all book MD files into searchable vectors in Qdrant, with metadata and anchor mapping.

Tasks

Create backend/scripts/ingest_to_qdrant.py

Read markdown files under SOURCE_DOCS_DIR recursively.

Parse frontmatter for title, sidebar_position, module, and chapter (if present).

Normalize file path → source_path relative to docs root.

Implement chunker:

Prefer token-aware chunking (use tokenizer for target LLM/embeds). If not available, fallback to paragraph-aware char chunking.

Parameters from .env: CHUNK_SIZE, CHUNK_OVERLAP.

Preserve char_start, char_end offsets per chunk for anchors.

Compute embeddings:

Use provider selected in EMBEDDING_PROVIDER env var. Support openai or gemini if possible.

Batch embedding calls for efficiency (--batch-size).

Upsert to Qdrant:

Create/recreate collection if --create-collection flag used and EMBED_DIM known.

Use payload structure:

{
  "source_path": "<relative/path.md>",
  "module": "<module>",
  "chapter": "<chapter>",
  "chunk_index": <int>,
  "char_start": <int>,
  "char_end": <int>,
  "text_preview": "<first 400 chars>",
  "anchor": "<slug>-chunk-<index>"
}


Output summary: files processed, chunks upserted, collection size.

Chunk anchor mapping

Generate backend/data/chunk_map.json mapping {source_path: [{chunk_index, anchor, char_start, char_end, qdrant_point_id}]}.

Option: optionally insert this mapping into Neon/Postgres later (deferred).

Collection configuration

If EMBED_DIM unknown, query embedding API for vector length or set by config.

Use vectors_config matching dimension and distance: COSINE.

CLI & flags

Provide --dry-run to preview chunk counts without upserting.

Provide --provider to switch embedding provider.

Provide logging & retry backoff.

Acceptance Criteria (Phase 1)

Running the script upserts all book chunks to Qdrant with payload metadata.

chunk_map.json created and matches payload anchors.

You can run a small search in Qdrant and get high-similarity chunks for test queries.

PHASE 2 — FASTAPI + OPENAI AGENTS (GEMINI) ORCHESTRATOR

Goal: Build FastAPI endpoints and an agent orchestrator that enforces selected-text-only logic and uses Qdrant retrieval as a tool.

Tasks

Scaffold backend app

backend/app/main.py:

Create FastAPI app, CORS for frontend origin, startup/shutdown events.

backend/app/models/schemas.py: Pydantic models for QueryIn, QueryOut, SourceMeta, IngestResponse.

Qdrant client wrapper

backend/app/services/qdrant_client.py:

Wrapper: search_vector(vector, top_k) → returns payloads + scores.

get_point_by_id(point_id) if needed.

Utility: anchor_to_doc_url(anchor) helper (concatenate BASE_URL + doc path + #anchor).

Embeddings adapter

backend/app/services/embeddings.py:

embed_texts(texts: List[str]) -> List[List[float]] using provider per env (Gemini/OpenAI).

Handle batching and fallback.

Agent orchestrator

backend/app/services/orchestrator.py:

Expose function answer_query(question, selection_text=None, user_id=None, top_k=4).

If selection_text provided:

Build system instruction that strictly forbids external context.

Call Gemini agent/chat completion only with the selection as context.

Else:

Embed the question, call qdrant_client.search_vector() to get top_k chunks.

Build a context_blocks array with chunk text & metadata.

Call the Gemini Agent with the qdrant_retrieve tool or inline context. The Agent prompt must instruct to use only the context blocks and to cite sources [source: path#chunk_index].

Return {answer, sources, used_selection}.

Important: Because you are using the OpenAI Agents SDK with Gemini, implement the agent so that qdrant_retrieve is registered as a tool if the SDK supports tool invocation. Otherwise, pass retrieved contexts inline in the prompt.

Routes

backend/app/routes/ingest.py: protected POST /api/ingest calling the ingestion script (requires INGEST_ADMIN_KEY).

backend/app/routes/query.py: POST /api/query implementing input validation and calling orchestrator.answer_query(); returns JSON with answer & sources.

backend/app/routes/health.py: simple healthcheck.

System instruction

Strict instruction text (non-negotiable) placed in orchestrator:

You are an assistant that must answer using ONLY the provided context blocks. 
If 'selection_text' is provided, treat it as the only context and do NOT consult external sources. 
If the context lacks the information, respond: "I don't have enough information in the selected text to answer that."
Cite any facts using [source: path#chunk_index].
Keep answer concise (<= 300 words) and add a 1-line next-step suggestion.


Logging

Basic logging for each query: timestamp, question, used_selection boolean, returned sources, latency, error if any.

Implement backend/app/logging.py or use structlog.

Acceptance Criteria (Phase 2)

POST /api/query returns correct answers for both selection_text and non-selection queries.

When selection_text present, no Qdrant search is performed (verify logs).

Agent responses include source citations in the required format.

Endpoint is CORS-enabled for frontend and secure (no secret leakage).

PHASE 3 — FRONTEND (Docusaurus chat widget + selection integration)

Goal: Provide an attractive, responsive chat UI in Docusaurus that supports selection-based querying and displays sources.

Tasks

Design considerations

Floating button (bottom-right), modal chat window, theme variables integration.

Accessible design (keyboard focus, aria labels).

Show selected-text badge and "Ask about selection" CTA.

Components

frontend/src/components/SelectionPopup.jsx

Detect text selection (window.getSelection()), threshold min length.

Render inline popup with CTA "Ask about selection".

On click, open ChatWidget and prefill selection_text.

frontend/src/components/ChatWidget.jsx

Modal with message list, input box, send button.

Display used_selection badge when present.

Display sources list under each bot message — each source is clickable and navigates to <BASE_URL>/docs/<source_path>#<anchor> via window.location.href or router.

Graceful error handling and loading states.

frontend/src/css/chat.css (styles using Docusaurus css variables).

Anchor handling

Configure ingestion to produce anchors like id="docs-<slug>-chunk-<index>".

Frontend source clicks navigate to doc path and run document.getElementById(anchor).scrollIntoView({behavior:'smooth', block:'center'}).

Integration

Add the widget root in src/theme/Layout or src/pages/_app.jsx depending on Docusaurus version.

Use environment REACT_APP_BACKEND_URL or BASE_URL to call /api/query.

Acceptance Criteria (Phase 3)

Selection popup appears when text is selected and "Ask about selection" pre-fills modal.

Chat modal displays answers and sources and clicking sources navigates to anchored section.

Widget is responsive and matches site theme.

PHASE 4 — TESTING, VALIDATION & DEMO

Goal: Validate all flows and create a judge-ready demo.

Unit tests & integration tests

Unit: chunker edge cases, embedding interface (mock), qdrant client wrapper (mock).

Integration:

Full ingestion → Qdrant search → known query returns the correct chunk(s).

Selection-only test:

Select a paragraph from a chapter that contains the answer.

Send question and assert agent answer uses selection and cites [source: path#chunk_index].

Selection-insufficient test:

Select a paragraph that does not contain the answer → expect "I don't have enough information in the selected text to answer that."

End-to-end UI test (manual): highlight → ask → get answer → click source → page scrolls.

Demo script (90s)

0–10s: Title slide + repo link.

10–30s: Show Docusaurus site, open a chapter.

30–55s: Select paragraph → click "Ask about selection" → show constrained answer with citation.

55–75s: Ask a general question (no selection) → show RAG answer with multiple sources → click source → navigate to anchored chunk.

75–90s: Close with notes on architecture and GitHub link.

Acceptance Criteria (Phase 4)

All tests pass; agent behaves per spec; demo recorded under 90s.

PHASE 5 — POLISH, CI & DEPLOY

CI: GitHub Actions for:

Run unit tests on push

Run scripts/ingest_to_qdrant.py --dry-run on docs updates (optional)

Deploy Docusaurus to GitHub Pages or Vercel on main.

Deployment:

Deploy FastAPI to Cloud Run / Vercel / Render (ensure environment variables set).

Ensure proper domain and CORS.

Monitoring:

Basic logging + Sentry (optional)

Usage metrics (per-endpoint logs)

DECISIONS NEEDING DOCUMENTATION (tradeoffs & rationale)

Using Gemini via OpenAI Agents SDK

Rationale: you specified Gemini key + OpenAI Agents SDK — use agent tool-calling when available to keep retrieval modular. Confirm SDK supports Gemini embeddings and tool-calling.

Tradeoff: If Gemini embeddings are unavailable/unstable via the SDK, fallback to OpenAI embeddings (text-embedding-3-small).

No Neon/Postgres in Phase 1

Rationale: MVP does not strictly require DB for selected-text functionality. Avoids initial complexity.

Tradeoff: Without DB you lose audit logs and personalization; these can be added later.

Chunk size selection

Tradeoff: smaller chunks → precise answers and better locality vs. higher ingestion and index cost. Recommended CHUNK_SIZE=800 chars with CHUNK_OVERLAP=100.

Pass contexts inline vs tool-calling

Tool-calling (registering qdrant_retrieve tool) improves separation of concern and makes agent more transparent. If Agents SDK does not support tool-calling with Gemini in your environment, pass inline context.

Anchors in Markdown files vs mapping file

Embedding anchors directly into Markdown is ideal for usability but modifies source files. Using a chunk_map.json avoids changing sources and can create virtual anchors via Docusaurus client-side navigation. Choose based on preference. Document choice.

TESTING STRATEGY (more detail)

Smoke tests: confirm ingestion script runs and Qdrant grows; confirm basic query returns non-empty results.

Behavioral tests:

Selection-only positive & negative tests

Non-selection retrieval quantitatively returns top_k relevant chunks

Performance tests:

Ingest time for full book

Median query latency (must be acceptable for UI, e.g., <2s for retrieval, <4s for agent answer)

Security tests:

Confirm no secrets leaked to frontend

Confirm ingestion endpoint is protected

Edge case tests:

Very long selection (>CHUNK_SIZE) — return early error prompt to user

Empty selection — disable selection button

RUNBOOK / IMPORTANT COMMANDS

Install backend deps:

cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt


Run ingestion (dry-run):

python backend/scripts/ingest_to_qdrant.py --dry-run


Create collection & ingest:

python backend/scripts/ingest_to_qdrant.py --create-collection --batch-size 64


Run FastAPI:

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000


Run frontend dev:

cd frontend
npm install
npm run start


Query endpoint example (selection-only):

curl -X POST https://backend.example.com/api/query \
 -H "Content-Type: application/json" \
 -d '{"question":"What is URDF used for?","selection_text":"<selected paragraph text here>"}'

ENVIRONMENT VARIABLES (final checklist)
# Qdrant
QDRANT_URL=
QDRANT_API_KEY=
QDRANT_COLLECTION=

# Docs & Ingest
SOURCE_DOCS_DIR=backend/data/docs
CHUNK_SIZE=800
CHUNK_OVERLAP=100
EMBEDDING_PROVIDER=gemini|openai
EMBEDDING_MODEL=text-embedding-3-small
EMBED_DIM=1536

# LLM / Agents (Gemini via OpenAI Agents SDK)
OPENAI_API_KEY_OR_GEMINI_KEY=
LLM_PROVIDER=gemini
LLM_MODEL=gemini-1.## (confirm actual model name)

# Backend & security
BASE_URL=https://backend.example.com
INGEST_ADMIN_KEY=some_secret_key

# Optional (deferred)
NEON_DATABASE_URL=

FINAL ACCEPTANCE CHECKLIST (must pass before submission)

 Ingestion script upserts book into Qdrant and produces chunk_map.

 FastAPI /api/query returns correct answers for selection-only and non-selection modes.

 Agent responses include proper [source: path#chunk_index] citations.

 Chat widget in Docusaurus shows selection popup, chat modal, answers, and clickable sources navigating to anchors.

 No secrets in frontend; ingestion endpoint protected.

 Demo video recorded (<= 90s) showing selection-only behavior and general RAG query.
