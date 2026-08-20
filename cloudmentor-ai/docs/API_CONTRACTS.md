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

- `GET /tests/next?user_id=` → { test_id, questions[] } (based on recent practice topics)
- `POST /tests/submit` — { test_id, answers[] } → { score, topic_breakdown: [{ topic, mastery_score }] }

## AI Buddy Service

- `POST /buddy/chat` — { user_id, message } → { reply, escalate_to_mentor: bool, suggested_mentor_id? }
- `GET /buddy/recommendation?user_id=` → { topic, reason }
- `GET /buddy/weekly-report?user_id=` → { summary_text, next_week_plan }

---

Update this file as you build — it's meant to change. The point is that everyone can build against these shapes without waiting on each other.
