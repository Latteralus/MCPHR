Mountain Care HR Dashboard Project Outline
This document describes the end-to-end plan for building the Mountain Care HR Dashboard website, designed for a pharmacy industry company. The project includes a secure login page and an HR dashboard with key features such as employee onboarding/offboarding, document compliance, and automation. The backend is built as a monolith using NestJS with feature modules, and the frontend is a Next.js application making simple HTTP/REST calls to the backend. All data is stored in a shared PostgreSQL database, and file storage is handled locally (or via a self-hosted solution like MinIO) through Docker.

1. Project Objectives
Rapid MVP Delivery: Quickly build a minimum viable product to demo the key features.

Modularity & Extensibility: Develop a monolithic backend with feature modules for easy addition of new features.

Client Separation: Create a Next.js frontend with a modular, microservice-like structure (within a single codebase) that communicates via HTTP with the backend.

Robust Data Management: Use a shared PostgreSQL database for all features.

Scalable File Storage: Handle document uploads locally (or with a self-hosted S3-compatible solution) using Docker volumes.

Future Scalability: Prepare the architecture to transition into separate microservices if needed in the future.

2. Technology Stack
Frontend: Next.js

For server-side rendering, fast development, and Vercel deployment.

Backend: NestJS (Monolith with Feature Modules)

Modular structure (Auth, HR Dashboard, Onboarding, Offboarding, Document/Compliance).

Database: PostgreSQL

Single, shared database with a defined schema for Users, Employees, Documents, and Tasks.

File Storage:

Option A: Local Docker volume for file storage (suitable for MVP).

Option B: Self-hosted S3-compatible storage (MinIO) for scalability.

Communication:

Simple HTTP/REST calls between the Next.js frontend and the NestJS backend.

3. Overall Architecture
Backend (NestJS Monolith):

Organized into feature modules such as:

Auth Module: Manages user registration, login, and JWT-based authentication.

HR Dashboard Module: Provides endpoints for dashboard metrics and activity feeds.

Onboarding Module: Handles employee onboarding tasks and processes.

Offboarding Module: Manages offboarding processes and checklists.

Document/Compliance Module: Manages document uploads, compliance tracking, and license expiration reminders.

Shared Database: A single PostgreSQL instance that stores all entities and relationships.

Frontend (Next.js):

Organized by feature areas (e.g., pages/login.tsx, pages/hr/dashboard.tsx, pages/hr/onboarding.tsx, etc.).

Connects to the NestJS backend using simple HTTP/REST API calls.

Deployed on Vercel for rapid MVP demo.

File Storage:

Documents are not stored as binary data in PostgreSQL but referenced via file paths.

Files can be stored in a Docker-mounted volume or through a self-hosted object storage solution like MinIO.

4. Step-by-Step Implementation Plan
Phase 1: Project Setup & Foundation
Repository & Version Control Setup

Create a GitHub organization (or similar) with two separate repositories:

mountain-care-backend (NestJS monolith)

mountain-care-frontend (Next.js app)

Define a common coding standard and branching strategy.

Database Design & Setup

Design the Schema:

Users: Contains user credentials, roles, and metadata.

Employees: Stores employee-specific details and links to user data.

Documents: References for document storage (file paths, types, expiration dates).

Tasks: Tables for onboarding/offboarding tasks.

Local Environment:

Spin up a PostgreSQL instance via Docker (or local install).

Use an ORM tool (e.g., TypeORM or Prisma) to define entities and manage migrations.

Create Initial Migrations:

Generate migration scripts for initial schema setup.

Phase 2: Backend (NestJS Monolith) Setup
Initialize the NestJS Project

Run: nest new mountain-care-backend

Configure environment variables (for DB credentials, JWT secrets, etc.).

Integrate the ORM

Install and configure your chosen ORM (TypeORM or Prisma).

Connect to PostgreSQL and test the connection.

Develop Feature Modules

Auth Module:

Create user entities, controllers, and services for registration and login.

Implement JWT-based authentication and role-based access guards.

HR Dashboard Module:

Develop endpoints to fetch and display overall metrics (employee count, compliance rate, etc.).

Onboarding Module:

Create endpoints to register new employees and track onboarding tasks.

Offboarding Module:

Create endpoints to manage employee offboarding processes.

Document/Compliance Module:

Build endpoints for file uploads (using multipart/form-data) and document retrieval.

Implement logic for tracking document expiration and compliance.

File Storage: Decide between using a local Docker volume or a self-hosted MinIO container. Store only file references in the database.

Implement Testing & Automation

Write unit tests for each module (using Jest).

Set up integration tests for API endpoints (e.g., using Supertest).

Implement scheduled tasks (using NestJS’s @Cron decorators) for compliance reminders.

Phase 3: Frontend (Next.js) Setup
Initialize the Next.js Project

Run: npx create-next-app mountain-care-frontend

Organize the project folder into:

Pages: For each view (login, dashboard, onboarding, offboarding, documents).

Components: For shared UI elements (header, footer, dashboard cards).

Services: To abstract API calls (authService, onboardingService, etc.).

Utils: Helper functions and common utilities.

Develop the Login Flow

Build a login page that sends credentials to the NestJS /auth/login endpoint.

Handle JWT token management (store in HTTP-only cookies or local storage with proper security).

Build the HR Dashboard & Feature Pages

Develop the HR dashboard page to display metrics and recent activity (fetched from the backend).

Create additional pages for onboarding, offboarding, and document management.

Ensure each page calls the corresponding backend API endpoints.

UI & UX Enhancements

Use a UI library (e.g., Material UI, Chakra UI) for consistency and rapid development.

Create reusable components to ensure modularity.

Phase 4: Integration & End-to-End Testing
Integrate Frontend and Backend

Configure environment variables in Next.js (e.g., NEXT_PUBLIC_API_URL) to point to the NestJS server.

Test API calls from the frontend to ensure data flows correctly.

Perform Testing

Run unit and integration tests on both frontend and backend.

Optionally, implement end-to-end tests using tools like Cypress or Playwright.

File Storage Testing

Verify that file uploads work as expected.

Ensure file references in the database correctly link to stored documents.

Test retrieval of documents from the local storage (or MinIO if chosen).

Phase 5: Deployment & Launch
Local & Staging Environment Setup

Use Docker Compose to create a local development environment that includes:

PostgreSQL container

NestJS backend container

(Optional) MinIO container or local volume for file storage

Validate the complete workflow in this local setup.

Deploy the Frontend

Deploy the Next.js application on Vercel.

Configure environment variables (e.g., API URL) on Vercel.

Deploy the Backend

Deploy the NestJS monolith (with PostgreSQL) to a suitable hosting platform (Heroku, Render, or a Linux VPS with Docker).

Ensure secure connections (HTTPS, proper CORS configuration, etc.).

Monitor & Validate

Perform final end-to-end tests in the staging/production environment.

Set up logging, monitoring, and error tracking.

Gather initial user feedback to plan subsequent iterations.

5. Future Enhancements & Iteration Roadmap
Automation & Cron Jobs:

Enhance scheduled tasks for license expiration reminders and compliance checks.

Additional HR & Admin Features:

Extend the HR dashboard with more detailed analytics and reporting.

Build an employee self-service portal for document uploads and HR functions.

Implement an Admin section for business administration functions.

Security Enhancements:

Continuously review and improve security measures (e.g., token handling, HTTPS enforcement).

Scalability Considerations:

As the project grows, evaluate splitting the monolith into separate microservices if necessary.

Consider advanced orchestration solutions (e.g., Kubernetes) if scaling demands increase.

CI/CD Pipeline:

Set up automated testing, deployment, and monitoring workflows to streamline future updates.

6. Summary & Conclusion
This step-by-step outline provides a clear roadmap for building the Mountain Care HR Dashboard project. Starting with a shared PostgreSQL database and a NestJS monolith with feature modules ensures a strong, modular foundation that is easy to extend. The Next.js frontend, organized by feature areas, will interact with the backend through simple HTTP calls, enabling rapid development and deployment on Vercel. As the project matures, future enhancements and possible migration to separate microservices will ensure scalability and maintainability.

By following these detailed phases—from initial setup, through development, testing, and finally deployment—we lay the groundwork for a robust and flexible HR solution tailored to Mountain Care's needs.

This comprehensive document should serve as both a roadmap and a reference guide throughout the project’s lifecycle.