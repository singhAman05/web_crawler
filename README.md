# Web Crawler Platform

A full-stack web crawler project with a modern dashboard frontend and a TypeScript backend API.

## What this project is about

This project lets you:
- Start a crawl job from a **seed URL**.
- Limit crawl depth using a **max pages** value.
- Track crawl status by **job ID**.
- Monitor jobs in a frontend interface with status, timing, and page counts.

### High-level architecture

- **Frontend (`frontend/`)**
  - Built with **Next.js + React + TypeScript**.
  - Provides a UI to start crawl jobs and check their status.
  - Calls backend endpoints like:
    - `POST /<api_version>/crawl/startJob`
    - `GET /<api_version>/crawl/:jobId`

- **Backend (`backend/`)**
  - Built with **Express + TypeScript**.
  - Manages crawl jobs in-memory.
  - Uses **Axios + Cheerio** to fetch pages and extract links.
  - Restricts crawling to the original host/domain of the seed URL.

## What to expect in the future

Based on the current structure, likely next improvements include:
- Persistent storage for jobs and crawl results (instead of in-memory only).
- Better observability (logs, metrics, and retries).
- Distributed/background workers for larger crawls.
- Authentication and access control for multi-user usage.
- Result export options (JSON/CSV) and richer crawl analytics.

## Where it is hosted

At the moment, this repository does **not** include a confirmed production URL.

- **Current expected setup:** local development (`localhost`) or private deployment.
- If/when production hosting is added, update this section with:
  - Frontend URL
  - Backend API base URL
  - Deployment platform details (e.g., Vercel/Render/AWS)

## Local installation and run guide

### Prerequisites

- Node.js 18+ (recommended latest LTS)
- npm 9+

### 1) Clone and enter the project

```bash
git clone <your-repo-url>
cd web_crawler
```

### 2) Install dependencies

Install backend and frontend dependencies separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3) Configure environment variables

#### Backend (`backend/.env`)

Create a `.env` file in `backend/`:

```env
PROJECT_NAME=WebCrawler
PORT=8000
API_VERSION=api/v1
```

> If you keep backend defaults (`PORT=6000`, `API_VERSION=api/v3`), make sure frontend uses the matching API base URL.

#### Frontend (`frontend/.env.local`)

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### 4) Run backend

```bash
cd backend
npm run dev
```

Backend health check:
- `GET http://localhost:8000/`

### 5) Run frontend

```bash
cd frontend
npm run dev
```

Open:
- `http://localhost:3000`

### 6) Basic usage

1. Enter a seed URL (example: `https://example.com`).
2. Set max pages.
3. Click start.
4. Expand a job in the table to refresh and inspect status details.

## Scripts

### Backend
- `npm run dev` — start development server (nodemon)
- `npm run build` — compile TypeScript
- `npm run start` — run compiled server from `dist/`

### Frontend
- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — lint codebase

## Notes

- Jobs are currently stored in memory and will be lost on server restart.
- Crawl status reflects backend runtime state only.
- Crawl behavior is domain-restricted to avoid crossing to external hosts.
