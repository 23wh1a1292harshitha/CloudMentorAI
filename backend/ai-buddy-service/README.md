# AI Buddy Service

Owner: Lead

Handles chat, recommendations, mistake explanations, and the escalation-to-mentor logic. Reads mastery scores from Testing Engine.

## Setup
```
cp .env.example .env
# Set JWT_SECRET (same value as testing-engine) and GEMINI_API_KEY
npm install
npm run dev
```

Runs on `http://localhost:4000`. Testing Engine must be running on `TESTING_ENGINE_URL` (default `http://localhost:4001`) for recommendations, weekly reports, and chat escalation.

## Endpoints
- `POST /auth/signup` / `POST /auth/login`
- `POST /buddy/chat`
- `POST /buddy/explain-mistakes`
- `GET /buddy/recommendation`
- `GET /buddy/weekly-report`

See `/docs/API_CONTRACTS.md` in the repo root.

## Sprint 1 goal
Chat endpoint wired to an LLM API, no personalization yet.
