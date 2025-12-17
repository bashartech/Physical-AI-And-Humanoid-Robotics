# Feature Specification: RAG + BetterAuth + Personalization + Translation

## Feature Description
Implement and integrate Better Auth (Next.js), Neon + Drizzle user persistence, FastAPI RAG backend (Qdrant), and Docusaurus frontend personalization + Urdu translation features. Use Gemini for LLM tasks and Drizzle/Neon for DB. Use selected-text and embeddings already implemented.

The system consists of three main folders:
- **/frontend**: Docusaurus documentation site
- **/backend**: FastAPI app with Qdrant integration and existing RAG chatbot
- **/auth**: Next.js app for Better Auth implementation

Note: A simple RAG chatbot is already integrated with Qdrant and Docusaurus, present inside the backend folder. This feature will enhance the existing chatbot with personalization and translation capabilities.

## User Scenarios & Testing

### Scenario 1: New User Registration and Personalization
- **Actor**: New user
- **Action**: Signs up, provides background information, and personalizes content
- **Flow**:
  1. User visits the documentation site
  2. Clicks "Sign Up" and provides credentials
  3. Completes background questionnaire (skill level, hardware experience, software experience, programming level, preferred learning style)
  4. Navigates to a chapter and clicks "Personalize"
  5. Receives content tailored to their experience level

### Scenario 2: Content Translation
- **Actor**: Registered user
- **Action**: Translates content to Urdu
- **Flow**:
  1. User selects content or navigates to a chapter
  2. Clicks "Translate to Urdu"
  3. Receives Urdu translation of the content while preserving formatting

### Scenario 3: Personalized Chat with RAG
- **Actor**: Registered user
- **Action**: Asks questions using the chatbot
- **Flow**:
  1. User selects text in a document
  2. Asks a question about the selected text
  3. Chatbot responds with personalized answers based on user profile
  4. Alternatively, asks general questions and receives RAG-enhanced responses
  5. Rag chatbot already working just update this feature.

## Functional Requirements

### 1. Authentication System (Better Auth)
- **FR-001**: Implement Next.js-based authentication system with Better Auth
- **FR-002**: Support Google OAuth and traditional email/password signup/login
- **FR-003**: Collect user background information during signup (skill level, hardware experience, software experience, programming level, preferred learning style)
- **FR-004**: Store user profiles in Neon database using Drizzle ORM
- **FR-005**: Issue secure JWT tokens for cross-service communication

### 2. Database Integration (Neon + Drizzle)
- **FR-006**: Use Neon Postgres as single source of truth for user profiles and personalization preferences
- **FR-007**: Implement Drizzle schema for user_profiles table with fields: user_id, skill_level, hardware_experience, software_experience, programming_level, preferred_learning_style, preferred_language
- **FR-008**: Implement personalization_settings table to store cached personalized content
- **FR-009**: FastAPI must use psycopg[binary] to query Neon for user profiles

### 3. RAG Backend (FastAPI + Qdrant)
- **FR-010**: Implement FastAPI backend with Qdrant integration for document retrieval
- **FR-011**: Use existing embedding model (all-MiniLM-L6-v2) for Qdrant ingestion and retrieval
- **FR-012**: Support selected-text queries that prioritize selection context over RAG retrieval
- **FR-013**: Ensure proper source citation in chat responses

### 4. Content Personalization
- **FR-014**: Implement server-side Gemini-based rewriting of chapter Markdown according to user profile
- **FR-015**: Preserve Markdown formatting (headings, code fences, anchors) during personalization
- **FR-016**: Add "Personalize" button in Docusaurus that triggers content personalization
- **FR-017**: Cache personalized content for faster future responses

### 5. Urdu Translation
- **FR-018**: Implement Gemini-based Urdu translation of full chapters or selected text
- **FR-019**: Preserve Markdown formatting during translation (code fences, tables, links, headings)
- **FR-020**: Add "Translate to Urdu" functionality in Docusaurus
- **FR-021**: Support both full chapter and selected text translation

### 6. Cross-Service Integration
- **FR-022**: Implement token validation between Docusaurus, Next.js Auth, and FastAPI
- **FR-023**: Enable communication between all services using defined API contracts
- **FR-024**: Support language preference in chat responses (English/Urdu)

## Success Criteria

### Quantitative Metrics
- Users can complete registration with background questions in under 2 minutes
- Content personalization completes in under 10 seconds for standard-length chapters
- Urdu translation completes in under 8 seconds for standard-length chapters
- Chat responses are delivered in under 3 seconds for 95% of queries
- System supports at least 100 concurrent users without performance degradation

### Qualitative Measures
- User satisfaction rating of 4.0/5.0 or higher for personalized content relevance
- Users report that translated content is understandable and accurate
- Developers can easily extend and maintain the integrated system
- Documentation is comprehensive and easy to follow

## Key Entities

### User Profile
- **User**: Identity information, authentication tokens
- **Profile**: Background information, preferences, learning style
- **Settings**: Personalization preferences, translation preferences, cached content

### Content Management
- **Chapter**: Original Markdown content
- **Personalized Content**: User-specific version of chapters
- **Translated Content**: Urdu versions of chapters or selections

### System Components
- **Authentication Service**: Next.js with Better Auth (in /auth folder)
- **Database**: Neon Postgres with Drizzle ORM
- **RAG Backend**: FastAPI with Qdrant integration and existing RAG chatbot (in /backend folder)
- **Frontend**: Docusaurus documentation site (in /frontend folder)
- **AI Services**: Gemini API for personalization and translation

## Assumptions
- Qdrant is already configured with the "RoboBook" collection and embeddings
- Selected-text implementation is already available in the frontend
- Gemini API access is properly configured with valid API keys
- The development environment supports Node 20.x and Python 3.10+

## Dependencies
- Qdrant service with proper API access
- Gemini API with sufficient quota for LLM operations
- Neon database with proper connectivity
- Frontend framework (Docusaurus) is properly configured
- Better Auth package and dependencies
- Existing RAG chatbot in backend folder (to be enhanced with personalization and translation)

## Scope
### In Scope
- Complete authentication flow with profile collection
- Personalization engine using user profiles
- Urdu translation functionality
- RAG-based chat with source citations
- Cross-service integration and validation
- Selected-text query handling

### Out of Scope
- Initial content creation for the documentation
- Infrastructure deployment (DevOps)
- Mobile app development
- Offline content synchronization
- Advanced analytics beyond basic metrics

## Technical Constraints
- Use Drizzle + Neon Postgres as the single source of truth
- Use Gemini API for all LLM tasks (personalization, translation, generation)
- Use existing embedding model (all-MiniLM-L6-v2) for Qdrant
- FastAPI must use psycopg[binary] to query Neon (no SQLAlchemy/Prisma)
- Do not introduce OPENAI_API_KEY in any generated code
- Use specified subagents for modularity and reusability
- Enhance existing RAG chatbot in backend rather than creating a new one
- Maintain compatibility with existing selected-text functionality in Docusaurus

## Clarifications

### Session 2025-12-12
- Q: Where will the code updates be applied? → A: Code updates will be applied across three main folders: /frontend (Docusaurus), /backend (FastAPI with existing RAG chatbot), and /auth (Next.js for Better Auth)
- Q: Is there an existing RAG chatbot? → A: Yes, a simple RAG chatbot is already integrated with Qdrant and Docusaurus, present inside the backend folder. This feature will enhance the existing chatbot with personalization and translation capabilities.