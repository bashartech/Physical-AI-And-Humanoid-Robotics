# Implementation Plan: Project Content Generation Guidelines

**Branch**: `001-read-style-md` | **Date**: 2025-12-04 | **Spec**: [specs/001-read-style-md/spec.md](specs/001-read-style-md/spec.md)
**Input**: Feature specification from `/specs/001-read-style-md/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation strategy for the "Project Content Generation Guidelines" feature. The primary objective is to develop a system that autonomously generates high-quality, deeply engaging educational book chapters for "Physical AI & Humanoid Robotics: Embodied Intelligence for the Real World." The technical approach involves leveraging Spec-Kit Plus for structured development, Claude Code as the primary AI collaborator, Context7 MCP for documentation automation, and a multi-agent architecture to ensure adherence to defined writing styles, educational principles, modular book structure, learning flow, and output formats, all optimized for Docusaurus publication and RAG chatbot integration.

## Technical Context

**Language/Version**: Python 3.10+ (for backend/robotics scripts), JavaScript/TypeScript (for Docusaurus frontend)
**Primary Dependencies**: Spec-Kit Plus, Claude Agent SDK, Context7 MCP, Docusaurus, OpenAI Agents (or ChatKit equivalent), FastAPI, Qdrant, NeonDB, ROS 2, Gazebo, NVIDIA Isaac Sim, Better-Auth (for personalization)
**Storage**: Qdrant (vector database for RAG), NeonDB (logs, metadata, potentially user personalization profiles), Local filesystem (for generated Markdown content and project artifacts)
**Testing**: Python: pytest; JavaScript/TypeScript: Jest/React Testing Library; Robotics: Gazebo/Isaac Sim integrated testing, ROS 2 unit/integration tests
**Target Platform**: Web (Docusaurus frontend), Linux/Windows (development environment, robotics simulations), Cloud (FastAPI backend, Qdrant, NeonDB)
**Project Type**: Multi-component (Educational Book Frontend, RAG Backend API, Robotics Simulation & Code Generation)
**Performance Goals**:
-   Chapter generation: <10 seconds per chapter (SC-006 from spec.md)
-   RAG chatbot response: <1 second for most queries
-   Docusaurus content loading: <500ms for initial page load
**Constraints**:
-   Content MUST be Docusaurus-compatible Markdown.
-   Generated code MUST be verifiable and runnable.
-   Personalization MUST integrate with Better-Auth.
-   Urdu translation MUST support RTL and preserve technical meaning.
-   No hardcoding of secrets.
**Scale/Scope**:
-   Full multi-part textbook as defined in constitution and spec.md.
-   Support for multiple user backgrounds (Beginner, Intermediate, Advanced).
-   Dual language support (English, Urdu).
-   Integrated RAG chatbot with contextual answering.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The implementation plan aligns well with the project's constitution, reinforcing its core principles and mandates.

-   **Project Identity**: The plan directly supports the creation of the specified book, aligning with its purpose, audience, and expected outputs. The roles of Docusaurus, Claude Code, and Context7 MCP are consistent with the constitution's definition of the UI and documentation automation engine.
-   **Mission Statement**: The plan contributes to building the AI-native textbook, automating writing via Spec-Kit Plus, Claude Code, and Context7, publishing with Docusaurus, and integrating the RAG chatbot as per the mission.
-   **Authoring Philosophy**: The plan ensures content generation adheres to modular structure, automated generation, comprehensive content requirements (theory, diagrams, code, exercises, quizzes), optimized Markdown for Docusaurus/RAG, and hackathon requirements (personalization, Urdu, selected-text RAG).
-   **Governance Rules for Claude Code**: The plan presumes Claude Code's adherence to Spec-Kit Plus hierarchy, Context7 MCP for templates/formatting, deterministic writing, verifiable robotics code (ROS 2, Gazebo, Isaac, Python), no hallucinations, optimization for Docusaurus/Qdrant/RAG, chatbot consumption awareness, thought boundaries, and allowed tools.
-   **Integration With Context7 MCP**: The plan explicitly leverages Context7 for documentation automation, chapter scaffolding, outline generation, documentation trees, search support, and spec-compliant file creation.
-   **Book Structure Standards**: The plan is designed to generate content strictly following the five-part book structure (Physical AI Fundamentals, ROS 2 Foundations, Simulation, Humanoid Robotics Engineering, Vision-Language-Action, Capstone), ensuring each part contains deep explanations, real code, diagrams, assignments, and quizzes.
-   **RAG Chatbot Integration Constitution**: The plan incorporates the need for chunkable Markdown, semantic headers/metadata, selected-text contextual answering, OpenAI Agents/ChatKit, FastAPI backend, and NeonDB for logs/metadata.
-   **Agent + Subagent Constitution**: The multi-level agent architecture, including Claude Code as primary and specific subagents (ChapterArchitect, RoboticsExpert, ROS2Engineer, IsaacSimEngineer, CodeReviewerAgent, PersonalizationAgent, UrduTranslateAgent, RAGContextFilterAgent), is implicitly supported by the plan's approach to content generation and validation.
-   **Personalization Rules**: The plan accommodates the generation of adaptive content based on user background (Beginner, Intermediate, Advanced) and ensures integration with Better-Auth.
-   **Urdu Translation Requirements**: The plan ensures content generation will support preservation of technical meaning, non-translation of APIs, use of formal academic Urdu, and Docusaurus RTL compatibility for Urdu translation.
-   **Quality & Reliability Standards**: The plan adheres to accuracy, reproducibility, update safety, correctness of robotics code, Markdown rules for Docusaurus, and RAG constraints for Qdrant, aligning with the quality standards.
-   **Hackathon Compliance Statement**: The plan is structured to directly contribute to achieving all base and bonus points related to the book, RAG, subagents, personalization, and Urdu translation.

**Conclusion**: All aspects of the plan are fully aligned with the project constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-read-style-md/
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
│   ├── api/                 # FastAPI endpoints for RAG, personalization, translation
│   ├── services/            # Business logic for content generation, RAG, auth integration
│   ├── models/              # Data models for Qdrant, NeonDB, user profiles
│   └── robotics/            # ROS 2 nodes, Isaac Sim scripts, Gazebo models
└── tests/
    ├── api/
    ├── services/
    └── robotics/

frontend/
├── src/
│   ├── components/          # Docusaurus custom components (e.g., interactive elements, quizzes)
│   ├── pages/               # Docusaurus content pages (rendered chapters)
│   ├── layouts/             # Docusaurus layouts for personalization, RTL
│   └── services/            # Frontend services for API interaction, user context
└── tests/
    ├── components/
    ├── pages/
    └── e2e/

.specify/
└── scripts/
    └── agent-specific/          # Scripts for agent context updates, PHR generation
```

**Structure Decision**: The project will adopt a multi-component structure, separating `frontend` (Docusaurus book UI) and `backend` (FastAPI for RAG, personalization, translation services). Within the `backend`, a `robotics` directory will house platform-specific code (ROS 2, Isaac Sim, Gazebo). The `.specify/scripts/agent-specific` directory will contain supporting scripts for agent operations. This structure facilitates clear separation of concerns, independent deployment, and scalability for both web content and backend services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitutional violations detected. The plan fully aligns with the project constitution.

## Detailed Implementation Phases

The content generation and publication process will proceed through the following iterative phases, aligning with the learning flow and quality goals, with a strong emphasis on frontend content first:

### Phase 0: Core Frontend Setup & Initial Content Generation

**Goal**: Establish a functional Docusaurus frontend, generate the outlines for all book modules, and begin populating initial content to be visible on the UI.

**Deliverables**:
-   Initial setup for Docusaurus project (confirmed as already done).
-   Detailed outlines for all **MODULES (1-5)**, including learning objectives, key examples, exercises, and checkpoint questions.
-   First draft content for early chapters of **MODULE 1: The Robotic Nervous System (ROS 2)** and **Part I — Physical AI Fundamentals**, adhering to writing style and educational principles.
-   Docusaurus page templates for rendering generated chapters.
-   Frontend Docusaurus components to display content, summaries, exercises, and quizzes.

**Key Activities**:
1.  **Tooling & Environment Setup (Frontend Focused)**:
    *   Confirm Claude Code environment for content generation.
    *   Ensure Docusaurus project is set up and functional for book publication.
    *   Confirm JavaScript/TypeScript environment and `Jest/React Testing Library` for frontend testing are configured.
2.  **Modular Outline Generation (All Modules)**:
    *   Leverage `ChapterArchitect subagent` to generate detailed outlines for all MODULES (1-5) based on the spec.md structure.
    *   Integrate tone and quality focus (simple, visual, intuitive, perfectly paced) from style guidelines for each module's outline.
3.  **Initial Content Generation (Module 1 & Part I Fundamentals)**:
    *   Claude Code (orchestrating `RoboticsExpert`, `ROS2Engineer`) generates first drafts for early ROS 2 chapters and Physical AI Fundamentals.
    *   Focus on building intuition before math, using body analogies for ROS 2 concepts.
    *   Incorporate text placeholders for diagrams, practical assignments, and quizzes.
4.  **Docusaurus UI Integration**:
    *   Develop `Docusaurus page templates` for rendering generated chapters in `frontend/src/pages/chapters/`.
    *   Integrate `frontend Docusaurus components` to display generated content, summaries, exercises, and quizzes in `frontend/src/components/content_display.jsx`.
5.  **Quality Assurance Loop (Content & Frontend)**:
    *   `CodeReviewerAgent` checks generated Markdown content for formatting, adherence to guidelines, and general quality.
    *   Human review for content quality, educational effectiveness, and Docusaurus rendering accuracy.
    *   Refine content based on feedback.

**Decisions to be Documented (in `research.md`)**:
-   Specific content generation workflows for various chapter types (theory, code-heavy, exercise-focused).
-   Strategy for managing content versioning within Docusaurus.

### Phase 1: Comprehensive Content Generation & Refinement

**Goal**: Generate and refine all remaining book content (Modules 2-5) to be fully populated and visible in the Docusaurus frontend, achieving high quality and adherence to guidelines.

**Deliverables**:
-   Draft content for **MODULE 2 (Digital Twin)**, **MODULE 3 (NVIDIA Isaac)**, **MODULE 4 (Vision-Language-Action)**, and **MODULE 5 (Autonomous Humanoid Capstone)** chapters.
-   All book content fully populated in Docusaurus, ready for user consumption.
-   Updated `quickstart.md` focused on verifying the generated book content.

**Key Activities**:
1.  **Module 2 (Digital Twin) Content Generation**:
    *   ChapterArchitect outlines chapters for Gazebo & Unity.
    *   Claude Code (orchestrating `RoboticsExpert`, `IsaacSimEngineer`) generates content focusing on digital twins, Gazebo physics, Unity visualization, and connecting ROS 2 to simulations.
    *   Generate code examples for building simulation worlds and debugging movement (as text within Markdown).
2.  **Module 3 (AI Robot Brain) Content Generation**:
    *   ChapterArchitect outlines chapters for NVIDIA Isaac.
    *   Claude Code (orchestrating `RoboticsExpert`, `IsaacSimEngineer`) generates content on perception, Isaac Sim as a lab, 3D understanding, SLAM, navigation, manipulation, and sim-to-real.
    *   Generate code for perception and awareness (as text within Markdown).
3.  **Module 4 (Vision-Language-Action) Content Generation**:
    *   ChapterArchitect outlines chapters for VLA.
    *   Claude Code (orchestrating `RoboticsExpert`) generates content on VLA concepts, speech-to-intent, LLMs in robotics, multimodal control loops, and safety.
    *   Generate code for VLA humanoid tasks (as text within Markdown).
4.  **Module 5 (Autonomous Humanoid Capstone) Content Generation**:
    *   ChapterArchitect outlines chapters for Capstone.
    *   Claude Code (orchestrating relevant subagents) generates content on system architecture, integrating all modules, designing behavior pipelines, and a final demo scenario.
    *   Provide clear, visual maps for integration (as text within Markdown).
5.  **Cross-Module Content Review**:
    *   Ensure all modules conceptually and narratively integrate cohesively into the Capstone project.
    *   Final reviews for all content, focusing on excitement and achievability for the Capstone.
6.  **Full Docusaurus Population**:
    *   Populate the entire Docusaurus site (`frontend/docs/`) with all generated and adapted content.

### Phase 2: Backend Core Infrastructure

**Goal**: Establish the core backend services and infrastructure required for the RAG chatbot, personalization, and Urdu translation, without fully integrating them into the frontend content flow yet.

**Deliverables**:
-   `data-model.md`: Data models for content metadata, user profiles, RAG embeddings.
-   `contracts/`: OpenAPI/GraphQL schema for RAG, personalization, translation APIs.
-   Basic FastAPI project structure (confirmed as already done).
-   Qdrant instance set up and client integrated.
-   NeonDB configured and client integrated.
-   Better-Auth integration for user profile management.
-   Verification of ROS 2, Gazebo, Isaac Sim environments (if relevant for backend logic/simulation services).
-   `quickstart.md` focused on verifying backend setup.

**Key Activities**:
1.  **Data Model Definition**:
    *   Define data models for content metadata (chapter, module, author, version), RAG chunks, Qdrant vectors, user personalization profiles.
    *   Establish relationships between entities in `backend/src/models/`.
2.  **API Contract Definition**:
    *   Design API endpoints for RAG query processing, personalization profile management, and translation services.
    *   Document input/output schemas, error taxonomy, and versioning in `specs/001-read-style-md/contracts/`.
3.  **Backend Service Initialization**:
    *   Initialize FastAPI backend for RAG, personalization, translation services.
    *   Set up Qdrant instance for vector database indexing and integrate client in `backend/src/services/qdrant_service.py`.
    *   Configure NeonDB for logging and metadata storage, integrate client in `backend/src/services/neon_db_service.py`.
    *   Set up Better-Auth integration for user profile management in `backend/src/services/auth_service.py`.
4.  **Robotics Environments Verification (Backend Support)**:
    *   Verify and configure ROS 2, Gazebo, and Isaac Sim environments (if backend services will interact with these for simulations or code validation).

### Phase 3: Personalization, Translation & RAG Backend Integration

**Goal**: Implement and integrate the backend logic for personalization, Urdu translation, and the RAG chatbot.

**Deliverables**:
-   `PersonalizationAgent` backend logic for adaptive content delivery.
-   `UrduTranslateAgent` backend logic for multilingual support.
-   RAG chatbot fully functional (backend services only) with Qdrant and OpenAI Agents/ChatKit.

**Key Activities**:
1.  **Personalization Backend Implementation**:
    *   Develop `PersonalizationAgent subagent` logic for adapting content difficulty based on user background in `backend/src/services/personalization_agent.py`.
    *   Integrate `PersonalizationAgent` with `Better-Auth` user profiles and content adaptation logic in `backend/src/services/content_personalization.py`.
2.  **Urdu Translation Backend Implementation**:
    *   Develop `UrduTranslateAgent subagent` logic for providing accurate and formal academic Urdu translations in `backend/src/services/urdu_translate_agent.py`.
    *   Integrate `UrduTranslateAgent` into the content generation pipeline (backend logic for translation requests).
3.  **RAG Chatbot Backend Implementation**:
    *   Develop FastAPI backend endpoints for RAG query processing in `backend/src/api/rag_routes.py`.
    *   Integrate `Qdrant` for vector indexing of chunked Markdown content (backend process).
    *   Implement selected-text-only contextual answering with `OpenAI Agents/ChatKit` (backend logic).
    *   Develop `RAGContextFilterAgent subagent` logic for optimizing content chunks for Qdrant ingestion and RAG query performance in `backend/src/services/rag_context_filter_agent.py`.

### Phase 4: Frontend-Backend Integration & Cross-Feature Testing

**Goal**: Integrate the Docusaurus frontend with the backend services for personalization, translation, and RAG chatbot, and conduct comprehensive cross-feature testing.

**Deliverables**:
-   Personalization features fully integrated and functional in the Docusaurus UI.
-   Urdu translation toggle fully integrated and functional with RTL support in Docusaurus.
-   RAG chatbot fully integrated into the Docusaurus UI for interactive learning.
-   End-to-end tests for all integrated features.

**Key Activities**:
1.  **Frontend Personalization Integration**:
    *   Integrate `PersonalizationAgent` with frontend components to dynamically display personalized content variants based on user profiles.
2.  **Frontend Urdu Translation Integration**:
    *   Integrate `UrduTranslateAgent` with Docusaurus frontend components to enable translation toggling and ensure RTL compatibility in `frontend/src/layouts/rtl_layout.jsx`.
3.  **Frontend RAG Chatbot Integration**:
    *   Integrate `RAG chatbot frontend components` into Docusaurus for interactive learning in `frontend/src/components/rag_chatbot.jsx`.
4.  **Cross-Feature Testing**:
    *   Conduct end-to-end testing for personalization, translation, and RAG integration, verifying seamless user experience across all features.
    *   Perform load and performance testing for the integrated system.

### Phase 5: Publication & Hackathon Preparation

**Goal**: Prepare the book for Docusaurus deployment, conduct final quality checks, and finalize hackathon submission.

**Deliverables**:
-   Docusaurus site fully populated and configured.
-   Final quality and reliability checks passed.
-   Hackathon compliance verified.
-   Deployment artifacts ready.
-   Detailed `README.md` for the hackathon submission.
-   Demo video script and plan for hackathon presentation.

**Key Activities**:
1.  **Docusaurus Deployment Preparation**:
    *   Finalize Docusaurus configuration, navigation, and styling in `frontend/docusaurus.config.js`.
2.  **Final Quality & Reliability Audit**:
    *   Conduct a comprehensive audit against all quality and reliability standards (accuracy, reproducibility, update safety, code correctness, Markdown rules, RAG constraints) for the entire integrated system.
3.  **Hackathon Compliance Verification**:
    *   Perform a final check to ensure all base and bonus points requirements are met as per the constitution.
4.  **Documentation & Readme Updates**:
    *   Ensure all project documentation is up-to-date.
    *   Prepare detailed `README.md` for the hackathon submission.
5.  **Demo Preparation**:
    *   Generate demo video script and plan for hackathon presentation.
