# API Contracts (draft — agree on these before Sprint 1 so everyone can work in parallel)

## Workspace Service

- `POST /workspace/start` — { user_id, type: "python"|"java"|"cpp"|"web"|"linux" } → { session_id, status }
- `POST /workspace/save` — { session_id } → { saved: true }
- `POST /workspace/stop` — { session_id } → { stopped: true }
- `POST /workspace/error-log` — { session_id, error_text } → forwarded to AI Buddy service

## Skill Exchange Service

- `GET /mentors?skill=python` → [{ mentor_id, name, skills[], rating, available_slots[] }]
- `POST /sessions/book` — { student_id, mentor_id, slot } → { session_id, status: "upcoming" }
- `GET /sessions/history?user_id=` → [{ mentor, topic, date, status }]

## Testing Engine

All `/tests/*` routes require `Authorization: Bearer <JWT from AI Buddy>`.

- `GET /tests/next?topic=` → { test_id, questions[] } (omitting topic prefers weak mastery areas)
- `POST /tests/submit` — { answers: [{ question_id, selected_option_id }] } → { score, topic_breakdown: [{ topic, mastery_score, attempts }], results: [{ question_id, topic, prompt, correct, selected_text, correct_text }] }
- `GET /tests/mastery` → { mastery: [{ topic, mastery_score, attempts }] }

## AI Buddy Service

Buddy routes require the same JWT. Recommendation / weekly report / chat escalation read mastery from Testing Engine.

- `POST /buddy/chat` — { message } → { reply, escalate_to_mentor: bool, suggested_topic? }
- `POST /buddy/explain-mistakes` — { missed: [{ prompt, topic, selected_text, correct_text }] } → { explanations }
- `GET /buddy/recommendation` → { topic, reason }
- `GET /buddy/weekly-report` → { summary_text, next_week_plan }

---

Update this file as you build — it's meant to change. The point is that everyone can build against these shapes without waiting on each other.
