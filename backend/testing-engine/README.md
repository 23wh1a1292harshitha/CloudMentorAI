# Testing Engine

Owner: Teammate C

Generates tests, scores them, and computes per-topic mastery scores that feed AI Buddy's escalation logic.

## Setup
```
cp .env.example .env
# Set JWT_SECRET to the same value as ai-buddy-service
npm install
npm run dev
```

Runs on `http://localhost:4001`. All `/tests/*` routes require the JWT issued by AI Buddy (`Authorization: Bearer <token>`).

## Endpoints

- `GET /tests/next` — next quiz (prefers weak topics when mastery exists)
- `POST /tests/submit` — `{ answers: [{ question_id, selected_option_id }] }` → score, topic breakdown, per-question results
- `GET /tests/mastery` — current mastery for the logged-in student

See `/docs/API_CONTRACTS.md` in the repo root.

## Sprint 1 goal
Basic quiz model — question bank, submit, auto-score MCQs.
