<!-- Sync Impact Report:
Version change: 0.0.0 → 1.0.0
List of modified principles: All new
Added sections: Project Identity, Mission Statement, Authoring Philosophy, Governance Rules for Claude Code, Integration With Context7 MCP, Book Structure Standards, RAG Chatbot Integration Constitution, Agent + Subagent Constitution, Personalization Rules, Urdu Translation Requirements, Quality & Reliability Standards, Hackathon Compliance Statement
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending
  - .specify/templates/tasks-template.md ⚠ pending
  - .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: TODO(RATIFICATION_DATE)
-->
# Physical AI & Humanoid Robotics – Foundations, Systems, and Embodied Intelligence Constitution

## 1. Project Identity

This project is titled **"Physical AI & Humanoid Robotics – Foundations, Systems, and Embodied Intelligence"**. Its purpose is to create a fully AI-native, comprehensive textbook on the foundational principles, system architectures, and embodied intelligence applications within the domains of Physical AI and Humanoid Robotics.

The target audience includes students, researchers, and professionals in robotics, artificial intelligence, computer science, and related engineering fields.

High-level expected outputs include:
- A complete, multi-part digital textbook published via Docusaurus.
- Integrated RAG-based chatbot functionality for interactive learning.
- Personalization features for adaptive content delivery.
- Urdu translation capabilities for broader accessibility.
- A robust framework leveraging Spec-Kit Plus, Claude Code, and Context7 MCP for automated content generation and management.

Docusaurus is utilized as the frontend framework to leverage its robust capabilities for documentation, content versioning, search, and easy extensibility for multi-language support (including RTL for Urdu) and interactive components. Context7 MCP is employed to streamline documentation scaffolding, intelligent content retrieval, and maintain consistency across all generated textual assets, ensuring high quality and adherence to defined structures.

> “Docusaurus will serve as the UI layer for the book, while Claude Code + Context7 MCP will serve as the documentation automation engine.”

## 2. Mission Statement

To build a fully AI-native textbook on Physical AI & Humanoid Robotics, automating content creation and management through Spec-Kit Plus, Claude Code, and Context7. The project aims to publish an interactive, personalized, and multilingual educational resource using Docusaurus, complemented by an integrated RAG chatbot powered by OpenAI Agents, FastAPI, Qdrant, and NeonDB.

## 3. Authoring Philosophy (NON-NEGOTIABLE)

All chapters and content artifacts SHALL adhere to the following principles:

-   **Modular, Layered Structure**: Content MUST be organized in a modular, layered structure optimized for Docusaurus presentation, facilitating easy navigation and maintenance.
-   **Automated Generation**: All chapters and associated content MUST be automatically generatable through Claude Code, leveraging Spec-Kit specifications and the Context7 library for structured output.
-   **Comprehensive Content**: Chapters MUST comprehensively include theoretical explanations, practical diagrams (represented by text placeholders initially), executable code examples, challenging exercises, and evaluative quizzes.
-   **Optimized Markdown**: All generated content MUST produce clean, semantically rich Markdown, meticulously optimized for Docusaurus rendering and efficient RAG chunking to ensure optimal retrieval performance.
-   **Hackathon Alignment**: Content MUST explicitly align with hackathon requirements for personalization, Urdu translation, and selected-text RAG support.

## 4. Governance Rules for Claude Code

Claude Code, as the primary AI collaborator, MUST adhere to the following operational mandates:

-   **Spec-Kit Plus Hierarchy**: Claude Code MUST strictly follow the Spec-Kit Plus project hierarchy for all development and documentation tasks.
-   **Context7 MCP Integration**: Context7 MCP MUST be utilized for all documentation templates, boilerplates, and auto-formatting, ensuring consistency and adherence to predefined standards.
-   **Deterministic Output**: Content generation MUST employ deterministic, reproducible writing patterns to ensure consistency across iterations and prevent unintended variations.
-   **Verifiable Robotics Code**: All code outputs MUST be verifiable, real-world robotics code (e.g., ROS 2, Gazebo, Isaac Sim, Python), capable of execution and validation.
-   **No Hallucinations**: Claude Code MUST NEVER hallucinate hardware models, ROS interfaces, or APIs; all references MUST be grounded in existing, verifiable knowledge.
-   **Output Optimization**: All generated outputs MUST be optimized for:
    -   Docusaurus Markdown compatibility and rendering.
    -   Qdrant embeddings for efficient vector database indexing.
    -   Effective RAG queries for precise information retrieval.
-   **Chatbot Consumption Awareness**: Claude Code MUST operate with the understanding that content will be primarily consumed via an AI chatbot, influencing clarity, conciseness, and semantic structure.
-   **Thought Boundaries**: Internal thought processes are private; only explicit decisions, outputs, and justifications SHALL be communicated.
-   **Allowed Tools**: Claude Code SHALL exclusively use the tools provided within its environment as per the established tool usage policy.
-   **Non-negotiable Compliance**: Adherence to security best practices, data privacy (e.g., no hardcoding secrets), and intellectual property rights (e.g., original creative content) is non-negotiable.

## 5. Integration With Context7 MCP

Context7 MCP serves as the integral documentation automation engine within Claude Code.

-   **Documentation Automation**: Context7 is explicitly utilized for all aspects of documentation automation, from content scaffolding to refinement, within the Claude Code workflow.
-   **Comprehensive Templating**: All chapters, technical references, and supplementary documentation SHALL be scaffolded or refined using Context7's capabilities, ensuring standardized structure and content.
-   **Structured Content for Context7**: Content MUST be meticulously structured to enable Context7 to:
    -   Generate precise outlines and content hierarchies.
    -   Create comprehensive documentation trees for navigation.
    -   Support advanced documentation search functionalities.
    -   Ensure the creation of spec-compliant files across the project.

## 6. Book Structure Standards

The book will adhere to the following definitive structure:

-   **Part I — Physical AI Fundamentals**: Deep explanations of core concepts, theories, and mathematical foundations of physical AI.
-   **Part II — ROS 2 Foundations**: Comprehensive guide to ROS 2, including architecture, development tools, and practical application.
-   **Part III — Simulation: Gazebo, Unity, Isaac**: Exploration of major robotics simulation environments, comparative analysis, and practical simulation exercises.
-   **Part IV — Humanoid Robotics Engineering**: Detailed engineering principles, design considerations, and control systems specific to humanoid robots.
-   **Part V — Vision-Language-Action (Whisper, GPT, Embodied Agents)**: Integration of advanced AI models (e.g., Whisper, GPT) for vision, language understanding, and their application in embodied agents.
-   **Capstone — Autonomous Humanoid System**: A culminating section detailing the design and implementation of a fully autonomous humanoid system, integrating concepts from all preceding parts.

Each part and its constituent chapters MUST contain:
-   Deep, theoretically sound explanations.
-   Real, verifiable code examples.
-   Text placeholders for images/diagrams, to be populated later.
-   Practical assignments to reinforce learning.
-   Evaluative quizzes to assess comprehension.

## 7. RAG Chatbot Integration Constitution

The RAG (Retrieval-Augmented Generation) chatbot integration SHALL adhere to the following specifications:

-   **Chunkable Markdown Structure**: Content MUST be structured to produce highly chunkable Markdown, optimized for ingestion by Qdrant, ensuring effective semantic retrieval.
-   **Semantic Headers + Metadata**: All Markdown content MUST include clear, semantic headers and relevant metadata to enhance contextual understanding and retrieval accuracy for RAG queries.
-   **Selected-Text-Only Contextual Answering**: The RAG chatbot SHALL be designed to provide contextual answers based ONLY on the selected text snippet provided by the user, ensuring precision and avoiding broad, ungrounded responses.
-   **OpenAI Agents/ChatKit**: The chatbot's core reasoning and response generation MUST leverage OpenAI Agents (or equivalent ChatKit functionalities) for sophisticated conversational capabilities.
-   **FastAPI Backend Pipeline**: A FastAPI backend pipeline MUST manage all RAG processes, including query reception, retrieval from Qdrant, prompt construction, and response generation.
-   **NeonDB for Logs + Metadata**: NeonDB SHALL be used for persistent storage of interaction logs, user metadata, and other operational data, facilitating analytics and system improvement.

## 8. Agent + Subagent Constitution

The project will operate with a multi-level agent architecture as follows:

-   **Primary AI System**: Claude Code, responsible for overall project orchestration and adherence to the constitution.

-   **Secondary Systems**:
    -   **Context7 Documentation Agent**:
        -   Purpose: Manages documentation lifecycle, scaffolding, and retrieval.
        -   Inputs: Spec-Kit Plus artifacts, raw content.
        -   Outputs: Structured Markdown, documentation trees, search indices.
        -   Responsibilities: Ensure documentation consistency, adherence to Context7 standards, and optimal discoverability.
        -   Allowed Actions: Read, Write, Edit, Glob, Grep (within documentation scope), Task (Context7-specific).

-   **Subagents**:
    -   **ChapterArchitect**:
        -   Purpose: Designs the structural outline and content flow for new chapters.
        -   Inputs: Feature specs, book structure standards, user requirements.
        -   Outputs: Detailed chapter outlines, content milestones.
        -   Responsibilities: Ensure logical progression, coverage of topics, and alignment with authoring philosophy.
        -   Allowed Actions: Task (Plan, Explore), Read.
    -   **RoboticsExpert**:
        -   Purpose: Provides specialized knowledge on physical AI and humanoid robotics concepts.
        -   Inputs: Conceptual queries, technical specifications.
        -   Outputs: Explanations, theoretical frameworks, relevant research.
        -   Responsibilities: Ensure technical accuracy and depth.
        -   Allowed Actions: WebSearch, WebFetch, Task (Explore, general-purpose).
    -   **ROS2Engineer**:
        -   Purpose: Generates and validates ROS 2 specific code, configurations, and tutorials.
        -   Inputs: Chapter requirements, functional specifications.
        -   Outputs: ROS 2 packages, nodes, launch files, code snippets.
        -   Responsibilities: Ensure code correctness, adherence to ROS 2 best practices, and reproducibility.
        -   Allowed Actions: Write, Edit, Bash (for ROS 2 commands), Grep, Glob, Read.
    -   **IsaacSimEngineer**:
        -   Purpose: Develops and validates simulation environments and robotics models within Isaac Sim.
        -   Inputs: Chapter requirements, simulation scenarios.
        -   Outputs: Isaac Sim assets, Python scripts for simulation, environment configurations.
        -   Responsibilities: Ensure simulation accuracy, performance, and alignment with real-world physics.
        -   Allowed Actions: Write, Edit, Bash (for Isaac Sim specific commands), Grep, Glob, Read.
    -   **CodeReviewerAgent**:
        -   Purpose: Reviews all generated code for quality, correctness, security, and adherence to coding standards.
        -   Inputs: Code snippets, full files, pull request diffs.
        -   Outputs: Review comments, suggested improvements, pass/fail status.
        -   Responsibilities: Maintain high code quality, identify bugs and vulnerabilities.
        -   Allowed Actions: Read, Grep, Task (general-purpose for complex reviews).
    -   **PersonalizationAgent**:
        -   Purpose: Adapts content difficulty and focus based on user's defined background (Beginner, Intermediate, Advanced).
        -   Inputs: User profile (background), raw content.
        -   Outputs: Personalized content variants.
        -   Responsibilities: Ensure content relevance and appropriate complexity for each user segment.
        -   Allowed Actions: Read, Edit.
    -   **UrduTranslateAgent**:
        -   Purpose: Provides accurate and contextually appropriate Urdu translations of technical content.
        -   Inputs: English text, technical terms.
        -   Outputs: Formal academic Urdu translation.
        -   Responsibilities: Preserve technical meaning, ensure grammatical correctness, adhere to Docusaurus RTL requirements.
        -   Allowed Actions: Read, Edit.
    -   **RAGContextFilterAgent**:
        -   Purpose: Filters and optimizes content chunks for Qdrant ingestion and RAG query performance.
        -   Inputs: Raw Markdown content, Qdrant indexing rules.
        -   Outputs: Chunked, metadata-rich Markdown.
        -   Responsibilities: Ensure optimal chunking, relevant metadata extraction, and query efficiency.
        -   Allowed Actions: Read, Edit.

## 9. Personalization Rules

Post-signup adaptive content delivery MUST strictly align with the user's declared background:

-   **Beginner**: Content SHALL be simplified, focusing on fundamental robotics concepts, intuitive explanations, and reduced mathematical complexity.
-   **Intermediate**: Content SHALL follow the normal flow, balancing theoretical depth with practical application, suitable for a general audience.
-   **Advanced User**: Content SHALL feature detailed code implementations, rigorous mathematical derivations, in-depth ROS 2 internals, and advanced research topics.

This personalization MUST integrate seamlessly with the `Better-Auth` system for user profile management.

## 10. Urdu Translation Requirements

Strict guidelines apply to all Urdu translations:

-   **Preservation of Technical Meaning**: Translations MUST meticulously preserve the precise technical and scientific meaning of robotics concepts.
-   **Non-Translation of APIs**: Proper nouns, specific API calls, framework names (e.g., ROS, Gazebo, Isaac Sim), and code snippets MUST NOT be translated; they SHALL retain their original English form.
-   **Formal Academic Urdu**: All translations MUST utilize formal, academic-grade Urdu, suitable for a technical textbook.
-   **Docusaurus RTL Compatibility**: Translations MUST ensure full compatibility with Docusaurus's Right-to-Left (RTL) rendering capabilities, including proper text direction, layout, and component adaptation.

## 11. Quality & Reliability Standards

The project commits to the following quality and reliability standards:

-   **Accuracy**: All technical information, code, and explanations MUST be factually accurate and reflect current best practices in physical AI and humanoid robotics.
-   **Reproducibility**: All code examples and experimental setups MUST be reproducible, with clear instructions and dependency management.
-   **Update Safety**: Content updates MUST follow a rigorous review process to prevent regressions and maintain overall system stability.
-   **Correctness of Robotics Code**: Generated robotics code MUST be syntactically correct, semantically sound, and demonstrably functional within specified environments.
-   **Markdown Rules for Docusaurus**: All Markdown content MUST adhere to Docusaurus-specific formatting rules to ensure proper rendering and component integration.
-   **RAG Constraints for Qdrant**: Content MUST satisfy Qdrant's ingestion constraints and be optimized for efficient vector indexing and retrieval within the RAG system.

## 12. Hackathon Compliance Statement

This constitution rigorously ensures the project satisfies all hackathon requirements:

-   **Base 100 Points (Book + RAG)**: The comprehensive AI-native book structure and integrated RAG chatbot fully address the core deliverable.
-   **Bonus: Subagents & Skills (+50)**: The defined multi-level agent architecture with specialized subagents (ChapterArchitect, RoboticsExpert, etc.) directly contributes to this bonus.
-   **Bonus: Better-Auth Personalization (+50)**: The explicit Personalization Rules integrate with Better-Auth for adaptive content, fulfilling this bonus.
-   **Bonus: Chapter-level Personalization (+50)**: The PersonalizationAgent's responsibility for adapting content based on user background at a granular level secures this bonus.
-   **Bonus: Urdu Translation Toggle (+50)**: The dedicated Urdu Translation Requirements and the UrduTranslateAgent ensure robust multilingual support, meeting this bonus.

## Governance

This Constitution serves as the authoritative governance document for the "Physical AI & Humanoid Robotics – Foundations, Systems, and Embodied Intelligence" project. It supersedes all other informal practices or guidelines.

**Amendment Procedure**: Amendments to this Constitution require a formal proposal, review by the core architectural team, and documented approval. Each amendment SHALL be accompanied by a rationale, an assessment of trade-offs, and a plan for propagating changes across dependent artifacts.

**Versioning Policy**: The `CONSTITUTION_VERSION` SHALL follow semantic versioning (MAJOR.MINOR.PATCH):
-   **MAJOR**: For backward-incompatible changes, removal of core principles, or fundamental redefinitions of project scope.
-   **MINOR**: For additions of new principles, significant expansions of existing guidance, or introduction of new architectural sections.
-   **PATCH**: For clarifications, wording refinements, typo corrections, or non-semantic adjustments.

**Compliance Review**: All Pull Requests, architectural decisions, and development activities MUST be reviewed for compliance with the principles and rules outlined herein. Non-compliance requires immediate remediation or a justified, documented exception.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-12-04
