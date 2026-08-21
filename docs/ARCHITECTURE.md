# Architecture — CloudMentor AI

## System Diagram (fill in / redraw as you build)

```
┌─────────────┐     ┌──────────────────────────────────────────┐
│  Frontend   │────▶│                 API Gateway                │
│  (React)    │     └──────────────────────────────────────────┘
└─────────────┘            │            │            │
                            ▼            ▼            ▼
                    ┌───────────┐ ┌────────────┐ ┌──────────────┐
                    │ Workspace │ │  Skill     │ │  AI Buddy /  │
                    │ Service   │ │  Exchange  │ │  Testing     │
                    │ (Docker   │ │  Service   │ │  Engine      │
                    │ sandboxes)│ │            │ │              │
                    └───────────┘ └────────────┘ └──────────────┘
                            │            │            │
                            ▼            ▼            ▼
                    ┌──────────────────────────────────────────┐
                    │        PostgreSQL + Redis + Vector DB      │
                    └──────────────────────────────────────────┘
```

## Data Flow — the core loop

1. **Learn**: AI Buddy reads the student's progress table and recommends a topic.
2. **Practice**: Student opens a Workspace container for that topic; actions/errors are logged.
3. **Test**: Testing Engine periodically serves a quiz on recently-practiced topics.
4. **Analyze**: Testing Engine scores the test and updates a per-topic mastery score; AI Buddy reads this score.
5. **Improve**: If mastery score for a topic stays below threshold after N attempts, AI Buddy:
   - generates a plain-language explanation of the recurring mistake, **and**
   - queries Skill Exchange for a mentor tagged with that skill, sorted by rating/availability.

## Key data models (starting point)

**User**: id, name, role (student/mentor), skills_known[], skills_to_learn[]

**PracticeSession**: id, user_id, workspace_type, topic, started_at, ended_at, errors_logged[]

**TestResult**: id, user_id, topic, score, questions[], taken_at

**TopicMastery**: user_id, topic, mastery_score (0–100), attempts, last_updated

**MentorSession**: id, student_id, mentor_id, topic, scheduled_at, status

## Escalation rule (starting point — tune with your team)

```
IF TopicMastery.mastery_score < 60
   AND TopicMastery.attempts >= 3
THEN AI Buddy surfaces a mentor recommendation
     tagged with that topic, ordered by rating
```

## Open questions to resolve as a team

- Real containers (Docker/K8s) vs. a simulated workspace for the demo? (Simulated is fine for a first working version — swap in real containers later if time allows.)
- Which LLM API for AI Buddy, and do you need RAG grounding for the MVP or is a well-prompted model enough?
- Auth: roll your own JWT auth or use a provider (Auth0/Clerk/Supabase Auth) to save time?
