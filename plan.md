Mountain Care HR Dashboard
1. Overall Architecture
Backend (NestJS Monolith)
Framework & Structure:

Build a monolithic backend application using NestJS.

Organize the code into distinct feature modules:

Auth Module:

Manage user registration, login, JWT-based authentication, and role-based access control.

HR Dashboard Module:

Provide endpoints to display key metrics (total employees, compliance rate, recent activities).

Onboarding Module:

Handle employee onboarding, including form submissions, task tracking, and automation triggers.

Offboarding Module:

Manage employee offboarding processes with checklists and automation.

Document/Compliance Module:

Enable document uploads and compliance tracking (with reminders for licensure/document expirations).

Database Integration:

Connect to a shared PostgreSQL database that stores all data (Users, Employees, Documents, Tasks, etc.).

Use an ORM (TypeORM or Prisma) to manage database schema and migrations.

File Storage:

Store file uploads (e.g., employee documents) on the server’s local file system.

Save only file paths or URLs in the database.

Frontend (Next.js)
Framework & Structure:

Build the user interface using Next.js for server-side rendered React pages.

Organize the project by feature:

Pages: Separate pages for Login, HR Dashboard, Onboarding, Offboarding, and Document Management.

Components: Shared UI components (navigation, cards, forms, etc.).

Services: Abstraction for API calls (e.g., authService, onboardingService).

Communication:

The Next.js frontend will interact with the NestJS backend using simple HTTP/REST API calls.

Deployment:

Initially deploy the Next.js application to Vercel for a rapid MVP demo, with plans to later migrate to a dedicated domain.

2. Recommended Development Sequence
Phase 1: Initial Setup & Database Design
Repository & Version Control:

Create separate repositories for:

'backend' (NestJS application)

mountain-care-frontend (Next.js application)

Define coding standards and branching strategies.

Database Design & Setup:

Design the PostgreSQL schema with tables for Users, Employees, Documents, and Tasks.

Set up a local PostgreSQL instance (installed directly on your development machine or on a local VM).

Generate initial migration scripts using your chosen ORM.

Phase 2: Backend (NestJS) Development
Initialize the NestJS Project:

Create the project with nest new 'backend'.

Set up environment variables for database connection, JWT secrets, etc.

Configure the ORM:

Integrate TypeORM or Prisma to connect to PostgreSQL and manage migrations.

Develop Feature Modules:

Auth Module:

Implement user registration, login endpoints, JWT issuance, and role-based guards.

HR Dashboard Module:

Create endpoints to fetch metrics and recent activity.

Onboarding Module:

Develop endpoints for employee creation and onboarding task tracking.

Offboarding Module:

Implement endpoints to handle employee offboarding processes.

Document/Compliance Module:

Build endpoints to handle file uploads (multipart/form-data) and document retrieval.

Implement logic for compliance tracking and scheduled reminders (using NestJS’s built-in scheduling features  (@Cron)).

Phase 3: Frontend (Next.js) Development
Initialize the Next.js Project:

Run npx create-next-app 'frontend'.

Set up the project folder with directories for pages, components, and services.

Develop the Authentication Flow:

Create a login page that calls the NestJS /auth/login endpoint.

Manage JWT tokens securely (e.g., via HTTP-only cookies).

Build the HR Dashboard & Feature Pages:

Develop the HR dashboard page to display data from the backend (metrics, recent activities).

Build pages for Onboarding, Offboarding, and Document Management.

Use the services folder to abstract and manage API calls to the backend.

Phase 4: Integration & Testing
Integrate Frontend & Backend:

Configure environment variables (e.g., NEXT_PUBLIC_API_URL) to point the Next.js app to the NestJS backend.

Test API calls from the frontend to ensure data is correctly fetched and displayed.

Testing:

Write unit tests for backend modules (using Jest and Supertest).

Implement unit tests for frontend components.

Optionally, create end-to-end tests using tools like Cypress or Playwright.

Phase 5: Deployment & Launch
Prepare for Deployment:

Prepare the NestJS application for deployment on a standard Linux server (without Docker).

Document the process for installing dependencies, setting up environment variables, and running the PostgreSQL database.

Deploy the Frontend:

Deploy the Next.js application to Vercel for the MVP.

Configure the production environment with the correct API URL.

Deploy the Backend:

Deploy the NestJS monolith on a Linux server (e.g., via PM2 or systemd for process management).

Ensure HTTPS is configured and CORS is set up correctly.

Post-Deployment:

Monitor the application, set up logging, and validate end-to-end functionality.

Gather initial user feedback for further refinements.

3. Key Considerations
Modularity & Maintainability:

Keeping the backend as a monolith with feature modules allows for clear separation of concerns and simplifies future enhancements.

The Next.js frontend, while in a single codebase, is structured by feature, making it easier to evolve individual sections independently.

Security:

Ensure endpoints are secured with role-based access control.

Handle JWT tokens securely and enforce HTTPS in production.

Scalability:

Although the MVP is built as a monolith, the code structure allows for easy refactoring into microservices if needed later.

The shared PostgreSQL database and local file storage solution are sufficient for early stages; they can be upgraded to managed or distributed systems as the application grows.

Documentation & Testing:

Document every step of the setup and deployment process to help future developers.

Write tests at multiple levels (unit, integration, and optionally E2E) to ensure a robust application.

4. Summary
This updated plan ensures that the Mountain Care HR Dashboard is built in a modular and scalable way:

Backend: A NestJS monolith with distinct feature modules, integrated with a shared PostgreSQL database and local file storage.

Frontend: A Next.js application organized by feature that communicates via simple HTTP/REST calls.

Deployment: Designed for a standard Linux server environment—no Docker required—ensuring straightforward setup and future scalability.

By following these phases and considerations, the application will be robust enough to meet immediate MVP needs while remaining flexible for future growth and enhancements.

This comprehensive plan should serve as a roadmap for the development and deployment of the Mountain Care HR Dashboard project.

# Structure

MCPHR/
├─ backend/
│  ├─ src/
│  │  ├─ auth/
│  │  ├─ hr-dashboard/
│  │  ├─ onboarding/
│  │  ├─ offboarding/
│  │  ├─ documents/
│  │  ├─ app.module.ts
│  │  └─ main.ts
│  ├─ ormconfig.ts (or .env)
│  ├─ package.json
│  └─ tsconfig.json
└─ frontend/
   ├─ pages/
   │  ├─ auth/
   │  ├─ dashboard/
   │  ├─ onboarding/
   │  ├─ offboarding/
   │  ├─ documents/
   │  └─ index.tsx
   ├─ components/
   ├─ services/
   ├─ public/
   ├─ package.json
   └─ tsconfig.json
