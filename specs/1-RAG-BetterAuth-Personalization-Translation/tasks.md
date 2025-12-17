# Tasks: RAG + BetterAuth + Personalization + Translation

## Feature Overview

**Feature**: RAG + BetterAuth + Personalization + Translation
**Description**: Implement and integrate Better Auth (Next.js), Neon + Drizzle user persistence, FastAPI RAG backend (Qdrant), and Docusaurus frontend personalization + Urdu translation features. Use Gemini for LLM tasks and Drizzle/Neon for DB. Use selected-text and embeddings already implemented.

**User Stories Priority**:
- US1: New User Registration and Personalization
- US2: Content Translation
- US3: Personalized Chat with RAG

**Subagents to Use**:
- **better-auth-agent**: For authentication implementation and user profile management
- **personalization-architect**: For content personalization using Gemini
- **qdrant-fact-retriever**: For RAG functionality with Qdrant
- **urdu-chapter-translator**: For Urdu translation using Gemini
- **user-profile-manager**: For managing user profiles and preferences

## Phase 1: Setup Tasks

- [X] T001 Create directory structure for /auth, /backend, /frontend if not present
- [X] T002 Create .env files for auth, backend, and frontend services if not present
- [X] T003 Set up initial package.json for auth service with dependencies
- [X] T004 Set up requirements.txt for backend service with dependencies if not present
- [X] T005 Set up initial package.json for frontend service with dependencies if not present
- [X] T006 Install Better Auth and Drizzle dependencies in auth service
- [X] T007 Install FastAPI, Qdrant, psycopg[binary], and Google Gemini dependencies in backend if not present
- [X] T008 Install JWT decoding and axios dependencies in frontend

## Phase 2: Foundational Tasks

- [X] T009 Set up Drizzle schema for user_profiles table in auth service
- [X] T010 Set up Drizzle schema for personalization_settings table in auth service
- [X] T011 Create Neon database connection in auth service
- [X] T012 Create JWT token generation and validation utilities in auth service
- [X] T013 Set up FastAPI app structure in backend service if not present
- [X] T014 Implement JWT validation middleware in backend service
- [X] T015 Connect backend service to Neon DB using psycopg[binary]
- [X] T016 Connect backend service to Qdrant for RAG functionality if not present
- [X] T017 Implement basic Docusaurus integration with auth state management

## Phase 3: [US1] New User Registration and Personalization

- [X] T018 [P] [US1] Use better-auth-agent to implement Next.js signup page with background questions in auth/pages/signup.tsx
- [X] T019 [P] [US1] Use better-auth-agent to implement Next.js login page in auth/pages/login.tsx
- [X] T020 [US1] Use better-auth-agent to create API route for signup with profile collection in auth/pages/api/signup.ts
- [X] T021 [US1] Use better-auth-agent to create API route for login with JWT token return in auth/pages/api/login.ts
- [X] T022 [US1] Use user-profile-manager to implement user profile storage in Neon DB after signup in auth/lib/user-profile.ts
- [X] T023 [P] [US1] Use personalization-architect to create personalization agent using Gemini in backend/agents/personalization.py
- [X] T024 [P] [US1] Implement personalization endpoint in backend/main.py using personalization-architect
- [X] T025 [US1] Add PersonalizeButton component to Docusaurus frontend/src/components/PersonalizeButton.js
- [X] T026 [US1] Connect PersonalizeButton to backend personalization API
- [X] T027 [US1] Implement caching for personalized content in backend/agents/personalization.py using personalization-architect
- [X] T028 [US1] Use user-profile-manager to add user profile retrieval endpoint in backend/main.py

## Phase 4: [US2] Content Translation

- [X] T029 [P] [US2] Use urdu-chapter-translator to create Urdu translation agent using Gemini in backend/agents/translation.py
- [X] T030 [P] [US2] Implement translation endpoint in backend/main.py using urdu-chapter-translator
- [X] T031 [US2] Preserve Markdown formatting during Urdu translation in backend/agents/translation.py using urdu-chapter-translator
- [X] T032 [US2] Add TranslateButton component to Docusaurus frontend/src/components/TranslateButton.js
- [X] T033 [US2] Connect TranslateButton to backend translation API
- [X] T034 [US2] Support both full chapter and selected text translation in backend/agents/translation.py using urdu-chapter-translator
- [X] T035 [US2] Use user-profile-manager to implement language preference storage in user profile in auth/lib/user-profile.ts

## Phase 5: [US3] Personalized Chat with RAG

- [X] T036 [P] [US3] Use qdrant-fact-retriever and personalization-architect to enhance existing RAG chatbot with personalization in backend/main.py
- [X] T037 [P] [US3] Use user-profile-manager and personalization-architect to integrate user profile data into chat responses in backend/main.py
- [X] T038 [US3] Support selected-text queries in chatbot in backend/main.py using qdrant-fact-retriever
- [X] T039 [US3] Use urdu-chapter-translator to implement language preference in chat responses (English/Urdu) in backend/main.py
- [X] T040 [US3] Use qdrant-fact-retriever to ensure proper source citation in chat responses in backend/main.py
- [X] T041 [US3] Update existing RAG chatbot UI in frontend/src/components/ChatWidget.jsx
- [X] T042 [US3] Connect chatbot to user profile for personalization using user-profile-manager
- [X] T043 [US3] Handle selected-text injection from Docusaurus frontend to chatbot using qdrant-fact-retriever

## Phase 6: Cross-Service Integration

- [X] T044 [P] Implement JWT validation between auth and backend services using better-auth-agent
- [X] T045 [P] Implement JWT validation between auth and frontend services using better-auth-agent
- [X] T046 [P] Set up session validation between Docusaurus and Next.js auth using better-auth-agent
- [X] T047 Connect Docusaurus to backend personalization API using personalization-architect
- [X] T048 Connect Docusaurus to backend translation API using urdu-chapter-translator
- [X] T049 Connect Docusaurus to backend chat API using qdrant-fact-retriever
- [X] T050 Implement token refresh mechanism in frontend using better-auth-agent
- [X] T051 Add error handling for authentication failures across services using better-auth-agent

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T052 Add comprehensive error handling throughout all services using better-auth-agent
- [X] T053 Implement logging and monitoring for all services
- [X] T054 Add performance monitoring for personalization (<10s) and translation (<8s)
- [X] T055 Add caching headers and optimization for personalized content using personalization-architect
- [X] T056 Create comprehensive documentation for the integrated system
- [X] T057 Add tests for authentication flows using better-auth-agent
- [X] T058 Add tests for personalization functionality using personalization-architect
- [X] T059 Add tests for translation functionality using urdu-chapter-translator
- [X] T060 Add tests for chat functionality using qdrant-fact-retriever
- [X] T061 Performance testing for 100 concurrent users
- [X] T062 Security validation of JWT implementation using better-auth-agent
- [X] T063 Final integration testing across all services using all subagents
- [X] T064 Check complete workflow from frontend docusaurus to backend to auth folder and write each technical and implementation step and workflow of this project in main readme.md file
 
## Dependencies

- **T001-T008** must be completed before any other phases
- **T009-T017** must be completed before US1, US2, and US3 phases
- **US1** (T018-T028) provides user authentication and basic personalization
- **US2** (T029-T035) provides translation functionality
- **US3** (T036-T043) provides enhanced chat functionality
- **Phase 6** (T044-T051) integrates all services together
- **Phase 7** (T052-T063) adds polish and validation

## Parallel Execution Examples

- **Parallel Tasks**: T006-T008 (install dependencies for different services)
- **Parallel Tasks**: T018-T019 (signup and login page creation)
- **Parallel Tasks**: T023-T029 (personalization and translation agents)
- **Parallel Tasks**: T044-T046 (JWT validation implementations)

## Implementation Strategy

**MVP Scope**: Complete Phase 1, Phase 2, and US1 (T001-T028) for basic auth and personalization
**Incremental Delivery**: Add translation (US2), then enhanced chat (US3), then integration and polish