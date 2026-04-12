# Prayer Studio Full Stack

A full-stack application for generating:

1. Relevant scripture passages
2. A sermon in a selected pastor-inspired style
3. A prayer in a selected pastor-inspired style

## Stack

- Frontend: Next.js (App Router, TypeScript)
- Backend: FastAPI
- RAG framework: LlamaIndex
- Vector storage: PostgreSQL + pgvector
- LLM provider: OpenAI-compatible API (default), swappable later

## Architecture

- Users enter their situation in a single main input box.
- Users pick one or more pastor styles as tags.
- Backend retrieves relevant chunks from indexed materials.
- A single orchestration endpoint returns three outputs:
  - scripture results
  - generated sermon
  - generated prayer

## Quick start

### 1. Environment

Copy `.env.example` to `.env` and fill values.

```bash
cp .env.example .env
```

### 2. Run with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend docs: http://localhost:8000/docs

### 3. Local development (without Docker)

Backend uses [uv](https://docs.astral.sh/uv/):

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Note: when running locally, point `DATABASE_URL` / `PGVECTOR_CONNECTION_STRING` at a reachable Postgres+pgvector instance (the values in `.env.example` use the Compose service name `db`).

### Environment variables

`NEXT_PUBLIC_API_BASE_URL` is the backend URL the **browser** uses (e.g. `http://localhost:8000`). `INTERNAL_API_BASE_URL` is what the Next.js **server** uses for SSR — inside Docker Compose this must be `http://backend:8000` so the frontend container can reach the backend over the Compose network.

## Suggested ingestion flow

1. Upload scripture material into source type `scripture`
2. Upload pastor sermons into source type `sermon`
3. Upload prayer collections into source type `prayer`
4. Tag sermon/prayer sources with pastor name, e.g. `spurgeon`, `lloyd-jones`, `tozer`

## Important notes

- This project is structured to be runnable, but you still need valid environment variables and package installation.
- PDF ingestion uses `pypdf`.
- Generation currently uses a single provider wrapper.
- The app is designed so you can later add reranking, evaluation, moderation, and collection-level filtering.
