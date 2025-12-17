# Implementation Plan: RAG + BetterAuth + Personalization + Translation

## Technical Context

**Project**: RAG + BetterAuth + Personalization + Translation
**Feature**: Integration of Better Auth, Neon + Drizzle user persistence, FastAPI RAG backend (Qdrant), and Docusaurus frontend personalization + Urdu translation features
**System Architecture**: Multi-service architecture with /auth (Next.js), /backend (FastAPI), and /frontend (Docusaurus)
**Primary LLM**: Google Gemini API
**Database**: Neon Postgres with Drizzle ORM
**Vector DB**: Qdrant
**Existing Components**: RAG chatbot already present in backend folder

**Unknowns/Dependencies to Research**:
- NEEDS CLARIFICATION: Specific JWT token validation implementation details between services
- NEEDS CLARIFICATION: Exact format and structure for user profile data in Neon DB
- NEEDS CLARIFICATION: Integration points between existing RAG chatbot and new personalization features
- NEEDS CLARIFICATION: Selected-text implementation details in Docusaurus frontend

## Constitution Check

Based on `.specify/memory/constitution.md` principles:
- ✅ Modularity: Using subagents for different functions (better-auth-agent, personalization-architect, etc.)
- ✅ Security: JWT-based auth, API key masking, HttpOnly cookies
- ✅ Performance: <10s personalization, <8s translation, <3s chat response targets
- ✅ Testing: Comprehensive testing criteria defined
- ✅ Documentation: Implementation follows spec requirements

## Gates

- ✅ **Architecture**: Multi-service design with clear separation of concerns
- ✅ **Security**: JWT validation, masked API keys, HttpOnly cookies
- ✅ **Performance**: Defined targets (personalization <10s, translation <8s, chat <3s)
- ✅ **Testing**: Acceptance criteria defined for auth, personalization, translation, chat
- ✅ **Dependencies**: All required services (Qdrant, Gemini, Neon) identified

## Phase 0: Outline & Research

### 0.1 Research Tasks

1. **JWT Token Validation Implementation**
   - Research JWT validation between Next.js Auth, FastAPI backend, and Docusaurus frontend
   - Determine token format and validation approach

2. **User Profile Schema Research**
   - Research Drizzle schema for user_profiles table
   - Define fields: user_id, skill_level, hardware_experience, software_experience, programming_level, preferred_learning_style, preferred_language

3. **Existing RAG Chatbot Integration**
   - Research current RAG chatbot implementation in backend
   - Identify enhancement points for personalization and translation

4. **Selected-Text Implementation**
   - Research existing selected-text functionality in Docusaurus
   - Determine integration points for translation and personalization

### 0.2 Best Practices Research

1. **Better Auth Integration Best Practices**
   - Research recommended patterns for Next.js + Better Auth
   - Study background question collection during signup

2. **FastAPI + Neon DB Integration Patterns**
   - Research psycopg[binary] usage with FastAPI
   - Study JWT validation patterns in FastAPI endpoints

3. **Gemini API Usage for Personalization**
   - Research optimal prompt engineering for content personalization
   - Study formatting preservation techniques for Markdown

## Phase 1: Design & Contracts

### 1.1 Data Model Design

**user_profiles table**:
```
- id: string (primary key)
- user_id: string (foreign key to Better Auth)
- skill_level: string (enum: beginner, intermediate, advanced)
- hardware_experience: string
- software_experience: string
- programming_level: string
- preferred_learning_style: string
- preferred_language: string (default: 'en')
- created_at: timestamp
- updated_at: timestamp
```

**personalization_settings table**:
```
- id: string (primary key)
- user_id: string (foreign key)
- chapter_path: string
- personalized_content: text
- cached_at: timestamp
- expires_at: timestamp
```

### 1.2 API Contracts

**Auth Service Endpoints**:
- `POST /api/auth/signup` → {email, password, profile_data} → {user, profile, jwt_token}
- `POST /api/auth/signin` → {email, password} → {user, jwt_token}
- `GET /api/auth/session` → {jwt_token} → {user, profile} or 401
- `POST /api/auth/validate` → {jwt_token} → {valid, user_id, email}

**Backend Service Endpoints**:
- `POST /api/personalize` → {chapter_path, raw_md, jwt_token} → {personalized_md, cached: bool}
- `POST /api/translate` → {chapter_path, raw_md?, selected_text?, jwt_token} → {translated_md}
- `POST /api/chat` → {question, selection_text?, chapter_path?, language, jwt_token} → {answer, sources}
- `GET /api/profile/me` → {jwt_token} → {user, profile}

### 1.3 Subagent Specifications

**better-auth-agent**:
- Implement Next.js routes for signup/login with background questions
- Create Drizzle migrations for user_profiles and personalization_settings
- Handle JWT token generation and validation

**personalization-architect**:
- Input: raw MD + user_profile
- Process: Gemini-based rewriting based on user profile
- Output: personalized MD via Gemini
- Preserve: Markdown formatting (headings, code fences, anchors)

**qdrant-fact-retriever**:
- Input: query or selection_text embedding
- Process: Qdrant vector search with existing all-MiniLM-L6-v2 model
- Output: top_k evidence chunks with source citations

**urdu-chapter-translator**:
- Input: raw MD or selected_text
- Process: Gemini-based Urdu translation
- Output: Urdu-translated MD
- Preserve: Markdown formatting (code fences, tables, links, headings)

**user-profile-manager**:
- Read/update Neon user_profile rows
- Manage cached personalized MD
- Handle user preference synchronization

### 1.4 Quickstart Guide

1. **Setup**:
   ```bash
   mkdir -p frontend backend auth
   touch auth/.env backend/.env frontend/.env.template
   ```

2. **Install Dependencies**:
   
   - check the dependencies and folder first if not present so then create

   ```bash
   # Auth Service
   cd auth && npm install better-auth drizzle-orm drizzle-kit @neondatabase/serverless zod axios

   # Backend Service
   cd backend && python -m venv .venv && source .venv/bin/activate
   pip install fastapi uvicorn qdrant-client psycopg[binary] python-dotenv google-generative-ai

   # Frontend Service
   cd frontend && npm install axios jwt-decode
   ```

3. **Database Setup**:
   ```bash
   cd auth && mkdir -p db/migrations
   npx drizzle-kit migrate
   ```

4. **Run Services**:
   ```bash
   # Auth Service
   cd auth && npm run dev

   # Backend Service
   cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8000

   # Frontend Service
   cd frontend && npm run start
   ```

## Phase 2: Implementation Tasks

### 2.1 Auth Service Implementation
- [ ] Scaffold Next.js app in /auth with Better Auth integration
- [ ] Implement signup flow with background question collection
- [ ] Create Drizzle schema for user profiles
- [ ] Implement JWT token generation and validation
- [ ] Create API endpoints for auth flows

### 2.2 Backend Service Implementation
- [ ] Set up FastAPI app with required dependencies
- [ ] Implement JWT validation middleware
- [ ] Create endpoints for personalization, translation, and chat
- [ ] Integrate with Qdrant for RAG functionality
- [ ] Connect to Neon DB using psycopg[binary]
- [ ] Integrate subagents for processing

### 2.3 Frontend Integration
- [ ] Add PersonalizeButton component to Docusaurus
- [ ] Add TranslateButton component to Docusaurus
- [ ] Implement AuthHook for session management
- [ ] Integrate with backend API endpoints
- [ ] Preserve existing selected-text functionality

### 2.4 Cross-Service Integration
- [ ] Implement JWT validation between services
- [ ] Set up session validation between Docusaurus and Next.js
- [ ] Connect Docusaurus to backend personalization/translation/chat
- [ ] Implement caching for personalized/translated content

## Phase 3: Testing & Validation

### 3.1 Auth & DB Testing
- [ ] Signup → verify users + user_profiles rows created
- [ ] Session validate → returns user profile
- [ ] JWT validation across services

### 3.2 Personalization Testing
- [ ] POST /api/personalize → personalized MD
- [ ] Check formatting preserved
- [ ] Cache stored if enabled

### 3.3 Translation Testing
- [ ] POST /api/translate → Urdu MD
- [ ] Preserve code fences, tables, links, headings
- [ ] Supports selected-text translation

### 3.4 Chat Testing
- [ ] POST /api/chat selection_text → answer only from selection
- [ ] POST /api/chat general → RAG answer + citations

### 3.5 Performance Testing
- [ ] Personalization <10s
- [ ] Translation <8s
- [ ] Chat <3s
- [ ] 100 concurrent users supported

## Risk Analysis

### Top 3 Risks
1. **JWT Token Validation Complexity**: Cross-service authentication may have security implications if not implemented correctly
2. **Performance Bottlenecks**: LLM calls to Gemini may exceed target response times
3. **Data Consistency**: Multiple services accessing Neon DB may cause race conditions

### Mitigation Strategies
1. Use well-tested JWT libraries and follow security best practices
2. Implement caching strategies and monitor API response times
3. Use database transactions and proper connection pooling

## Operational Readiness

### Monitoring
- Log API response times for personalization, translation, and chat
- Monitor JWT validation failures
- Track user profile creation and updates

### Deployment
- Auth Service: Deploy Next.js app with environment variables
- Backend Service: Deploy FastAPI app with proper scaling
- Frontend Service: Deploy Docusaurus site with auth integration