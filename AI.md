You are a senior full-stack developer tasked with building a comprehensive HR Dashboard web application for a company called "Mountain Care" in the Pharmacy industry. The application should include a secure login page leading to an HR dashboard and be built in a modular manner. The architecture must support rapid MVP development while remaining scalable for future enhancements. (Review plan.md after reviewing this file)

Requirements:

Overall Architecture:


Backend (NestJS Monolith):

Develop a monolithic backend application using NestJS, structured with feature modules.

Create distinct modules for:

Auth: Manage user registration, login, and JWT-based authentication with role-based access control.

HR Dashboard: Provide endpoints to display overall metrics (e.g., total employees, compliance rate, recent activities).

Onboarding: Handle employee onboarding processes including form submissions, task automation, and status tracking.

Offboarding: Manage employee offboarding with checklists and automation.

Document/Compliance: Support document uploads and compliance tracking, including automated reminders for upcoming licensure/document expirations.

Use simple HTTP/REST API calls for client-backend communication.

Integrate with a shared PostgreSQL database to store all data (Users, Employees, Documents, Tasks, etc.).

Frontend (Next.js):

Build a Next.js application for a modern, server-side rendered React interface.

Organize the code modularly by feature (e.g., separate pages for login, HR dashboard, onboarding, offboarding, and document management).

Ensure the frontend communicates with the NestJS backend using HTTP/REST API calls.

Initially deploy the Next.js app to Vercel as the MVP, with plans to later transition to a dedicated domain if needed.

Database & File Storage:

Database:

Design and implement the PostgreSQL schema with tables for Users, Employees, Documents, and Tasks.

Utilize TypeORM to manage migrations and database interactions.

File Storage:

Handle file uploads (for employee documents) by storing files on the server’s local file system.

Store file paths or URLs in the PostgreSQL database rather than binary data.

Security & Best Practices:

Secure all endpoints with proper role-based access guards.

Implement JWT-based authentication and manage tokens securely (using HTTP-only cookies).

Use HTTPS in production and configure CORS appropriately.

Write unit and integration tests (using Jest and Supertest) for backend modules, and consider E2E tests for the frontend.

Deployment & Scalability:

Prepare the application for deployment on a standard Linux server (without Docker).

Provide clear documentation for setting up the development environment, including instructions on installing dependencies, configuring environment variables, and running the PostgreSQL database.

Ensure the architecture is modular enough that future enhancements or migration to separate microservices can be done without major refactoring.

Task:

Build the complete Mountain Care HR Dashboard application based on the details above. Your implementation should include:

A clear code structure for both the NestJS backend (organized into feature modules) and the Next.js frontend (organized by feature pages and shared components).

A complete set of API endpoints for each feature module (Auth, HR Dashboard, Onboarding, Offboarding, Document/Compliance) with proper request/response validation.

Database schema definitions and migration scripts using TypeORM.

File upload handling with logic to store and retrieve file references.

A secure login flow that integrates the frontend with the backend.

Comprehensive documentation on setting up the development environment, running tests, and deploying the application on a standard Linux server (without using Docker).

Provide all necessary code and documentation to ensure that another developer can understand, run, and extend this application.