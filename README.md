# RAG + BetterAuth + Personalization + Translation System

This project integrates multiple AI-powered features into a comprehensive educational platform that combines RAG (Retrieval Augmented Generation), user authentication, content personalization, and translation capabilities. The system follows a multi-service architecture with Next.js for authentication, FastAPI for backend processing, and Docusaurus for frontend delivery.

## Complete Technical Workflow & Implementation 

### System Architecture Overview

The system is built as a multi-service architecture with three main components that work together seamlessly:

#### 1. Frontend Service (Docusaurus)
- **Purpose**: Educational content delivery and user interaction
- **Technology**: Docusaurus documentation platform with React components
- **Features**:
  - Personalize button for content adaptation
  - Translate button for language conversion
  - Interactive chat widget with selected text integration
  - User authentication state management
  - Markdown content rendering with formatting preservation

#### 2. Auth Service (Next.js)
- **Purpose**: Handles user authentication and profile management
- **Technology**: Next.js with Better Auth, Drizzle ORM, Neon Postgres
- **Features**:
  - User registration with comprehensive background questions
  - JWT-based authentication with secure token management
  - User profile storage with learning preferences
  - Session management and validation endpoints
  - API routes for signup, login, and token validation

#### 3. Backend Service (FastAPI)
- **Purpose**: AI processing, RAG functionality, and API endpoints
- **Technology**: FastAPI, Qdrant vector database, Google Gemini
- **Features**:
  - Personalization using user profiles and AI models
  - Urdu translation with markdown formatting preservation
  - RAG-powered chat with source citations
  - JWT validation middleware for secure communication
  - Performance monitoring and intelligent caching

### Complete Workflow from Frontend to Backend to Auth

#### User Registration Flow
1. **Frontend (Docusaurus)** → User accesses signup page
   - Redirects to Auth service signup page
   - `frontend/src/components/PersonalizeButton.js` and `TranslateButton.js` check authentication status
   - Authentication utilities in `frontend/src/utils/auth.js` manage session state

2. **Auth Service (Next.js)** → User registration with profile collection
   - `auth/app/signup/page.tsx` presents comprehensive form with background questions:
     - Skill level (beginner/intermediate/advanced)
     - Hardware and software experience
     - Programming level
     - Preferred learning style
     - Preferred language
   - `auth/app/api/auth/signup/route.ts` processes registration
   - User profile stored in Neon DB via `auth/db/schema.ts`
   - JWT token generated using `auth/lib/jwt.ts`
   - Token returned to frontend and stored in localStorage

3. **Backend Service (FastAPI)** → Profile validation and storage
   - `backend/main.py` includes `/profile/me` endpoint for profile retrieval
   - `backend/middleware/jwt_middleware.py` validates tokens from auth service
   - User profile data available for personalization and translation

#### Content Personalization Flow
1. **Frontend (Docusaurus)** → User clicks Personalize button
   - `frontend/src/components/PersonalizeButton.js` sends request to backend
   - Includes JWT token and raw content for personalization
   - Checks authentication status before making API call

2. **Backend Service (FastAPI)** → Personalization processing
   - `backend/main.py` receives `/personalize` request
   - JWT token validated using middleware
   - User profile extracted from token or database
   - `backend/agents/personalization.py` processes content with Google Gemini
   - Content adapted based on user profile (skill level, experience, learning style)
   - Caching implemented to reduce repeated processing
   - Personalized content returned to frontend

3. **Frontend (Docusaurus)** → Personalized content display
   - Received personalized content replaces original content
   - Maintains markdown formatting and structure
   - User sees content tailored to their profile

#### Content Translation Flow
1. **Frontend (Docusaurus)** → User selects translation options
   - `frontend/src/components/TranslateButton.js` provides language selection
   - User can translate full content or selected text
   - Includes JWT token for user language preferences

2. **Backend Service (FastAPI)** → Translation processing
   - `backend/main.py` receives `/translate` request
   - JWT token validated and user preferences extracted
   - `backend/agents/translation.py` processes content with Google Gemini
   - Markdown formatting preserved during translation
   - Supports multiple languages (Urdu, English, Spanish, French, German)
   - Translated content returned to frontend

3. **Frontend (Docusaurus)** → Translated content display
   - Received translated content displayed in selected language
   - Formatting preserved for proper rendering
   - User sees content in their preferred language

#### RAG-Powered Chat Flow
1. **Frontend (Docusaurus)** → User asks question in chat
   - `frontend/src/components/ChatWidget.jsx` handles chat interface
   - Supports general questions and selected-text queries
   - Includes JWT token for personalization context

2. **Backend Service (FastAPI)** → Chat processing
   - `backend/main.py` receives `/chat` request
   - JWT token validated and user profile extracted
   - `qdrant_client` queries vector database for relevant information
   - `agents.personalization` creates personalized AI assistant
   - Qdrant results used as context for AI response
   - Personalized response with source citations returned to frontend

3. **Frontend (Docusaurus)** → Chat response display
   - AI response displayed in chat interface
   - Source citations provided for fact-based answers
   - User sees personalized responses based on their profile

### Technical Implementation Details

#### Frontend Service (Docusaurus) Implementation
- **Components**:
  - `PersonalizeButton.js`: Handles content personalization requests
  - `TranslateButton.js`: Manages translation requests with language selection
  - `ChatWidget.jsx`: Interactive chat interface with markdown rendering
  - Authentication utilities for session management

- **Key Features**:
  - Selected text integration for focused queries
  - Markdown rendering with `react-markdown`, `remark-gfm`, `rehype-raw`
  - JWT token management in localStorage
  - API request utilities with error handling

#### Auth Service (Next.js) Implementation
- **API Routes**:
  - `/api/auth/signup`: User registration with profile collection
  - `/api/auth/login`: User authentication
  - `/api/auth/validate`: JWT token validation
  - `/api/auth/refresh`: Token refresh functionality

- **Database Schema**:
  - `userProfiles` table with comprehensive user profile fields
  - Drizzle ORM for database operations
  - Neon Postgres for scalable storage

- **Security Features**:
  - JWT token generation with HS256 algorithm
  - Secure token expiration (7 days)
  - Input validation and sanitization

#### Backend Service (FastAPI) Implementation
- **API Endpoints**:
  - `POST /personalize`: Content personalization with caching
  - `POST /translate`: Content translation with formatting preservation
  - `POST /chat`: RAG-powered chat with source citations
  - `GET /profile/me`: User profile retrieval

- **AI Integration**:
  - Google Gemini API for personalization and translation
  - Qdrant vector database for RAG functionality
  - SentenceTransformer for embedding generation
  - Custom agents for specialized tasks

- **Security & Performance**:
  - JWT validation middleware
  - Rate limiting and error handling
  - Performance monitoring and logging
  - Caching for improved response times

### Data Models and Schema

#### User Profiles Schema (auth/db/schema.ts)
```typescript
export const userProfiles = pgTable('user_profiles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  skillLevel: varchar('skill_level', { length: 50 }),
  hardwareExperience: text('hardware_experience'),
  softwareExperience: text('software_experience'),
  programmingLevel: varchar('programming_level', { length: 50 }),
  preferredLearningStyle: varchar('preferred_learning_style', { length: 50 }),
  preferredLanguage: varchar('preferred_language', { length: 10 }).default('en'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### Personalization Settings Schema
```typescript
export const personalizationSettings = pgTable('personalization_settings', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  chapterPath: varchar('chapter_path', { length: 500 }),
  personalizedContent: text('personalized_content'),
  cachedAt: timestamp('cached_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
});
```

### Cross-Service Communication

#### Auth ↔ Backend Communication
- JWT tokens passed in Authorization headers
- Backend validates tokens using shared secret
- User profile data extracted from tokens for personalization
- Middleware ensures secure communication

#### Frontend ↔ Backend Communication
- API calls with JWT tokens for authentication
- JSON request/response format
- Error handling and retry mechanisms
- CORS configuration for secure cross-origin requests

#### Frontend ↔ Auth Communication
- Session state management
- Token storage and retrieval
- Redirects for authentication flows
- Secure token handling

### Security Implementation

#### JWT Token Flow
1. User authenticates via Auth service
2. Auth service generates JWT with user profile data
3. Token stored securely in frontend
4. Token included in API requests to Backend
5. Backend validates token and extracts user information

#### Security Measures
- HS256 algorithm for JWT signing
- Token expiration for security
- Input validation on all endpoints
- Secure API key management
- CORS configuration for safe cross-origin requests

### Performance Optimization

#### Caching Strategy
- Personalized content caching with TTL
- Translation result caching
- Database query optimization
- CDN-ready static assets

#### Response Time Targets
- Personalization: <10 seconds
- Translation: <8 seconds
- Chat responses: <3 seconds
- Authentication: <2 seconds

### Testing & Quality Assurance

#### Testing Strategy
- Unit tests for individual components
- Integration tests for cross-service functionality
- Performance tests for response times
- Security validation for JWT implementation
- End-to-end workflow testing

#### Quality Measures
- Comprehensive error handling
- Logging and monitoring
- Input validation and sanitization
- Graceful degradation for service failures

### Deployment Configuration

#### Environment Variables
**Auth Service (.env)**:
```
DATABASE_URL=neon_database_url
AUTH_SECRET=your_jwt_secret
NEXT_PUBLIC_FRONTEND_URL=frontend_url
```

**Backend Service (.env)**:
```
GEMINI_API_KEYS=your_gemini_api_key
QDRANT_URL=qdrant_server_url
QDRANT_API_KEY=qdrant_api_key
DATABASE_URL=neon_database_url
AUTH_SERVICE_URL=auth_service_url
NEXT_PUBLIC_FRONTEND_URL=frontend_url
```

**Frontend Service (.env)**:
```
REACT_APP_BACKEND_URL=backend_api_url
REACT_APP_AUTH_URL=auth_service_url
```

### Development Workflow

#### Running Locally
1. Start Auth service: `cd auth && npm run dev`
2. Start Backend service: `cd backend && uvicorn main:app --reload`
3. Start Frontend service: `cd frontend && npm run start`

#### API Testing Endpoints
- Auth endpoints: http://localhost:3000/api/auth/*
- Backend endpoints: http://localhost:8000/*
- Frontend: http://localhost:3001

### Error Handling & Recovery

#### Common Error Scenarios
1. **JWT Validation Failure**: User redirected to login
2. **Database Connection Issues**: Graceful degradation with error messages
3. **AI Service Unavailable**: Fallback responses without personalization
4. **Network Issues**: Retry mechanisms and user-friendly error messages

This system provides a comprehensive, scalable platform for personalized, multilingual educational content delivery with AI-powered assistance. The architecture ensures security, performance, and maintainability while providing a seamless user experience across all services.
