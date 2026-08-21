# CloudMentor AI ☁️

An intelligent cloud-based learning platform that combines practice, testing, AI guidance, and peer mentorship in one place.

CloudMentor AI runs a continuous loop for every learner:

**Learn → Practice → Test → Analyze → Improve**

## Modules

| Module | Description |
|---|---|
| **Cloud Workspace** | Ready-to-use cloud environments for Programming (Python/Java/C++), Web Dev (HTML/CSS/JS/React/Node.js), and Linux — no local installs. Supports save/resume and auto-stops idle sessions. |
| **Skill Exchange** | Connects students with peer mentors. Profiles, skill-based mentor search, session booking, real-time chat, session history. |
| **AI Buddy** | Analyzes daily practice *and* test results to track progress and flag weak areas. Runs regular tests; if a student struggles repeatedly, it gives extra guidance and recommends a suitable mentor. |

## Repo Structure

```
cloudmentor-ai/
├── frontend/                    # Web app (student & mentor UI)
├── backend/
│   ├── workspace-service/       # Cloud Workspace provisioning & session mgmt
│   ├── skill-exchange-service/  # Profiles, matching, booking, chat
│   ├── ai-buddy-service/        # Recommendation engine, doubt resolution, escalation
│   └── testing-engine/          # Test generation, scoring, weak-area detection
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TASK_BOARD.md
│   └── API_CONTRACTS.md
└── .github/                     # Issue & PR templates
```

## Team

| Member | Role | Owns |
|---|---|---|
| You (Lead) | Architect / Integrator | AI Buddy core logic, module integration, sprint management |
| Teammate A | Workspace Engineer | `backend/workspace-service`, workspace UI |
| Teammate B | Exchange Engineer | `backend/skill-exchange-service`, mentor UI |
| Teammate C | Test & Analytics Engineer | `backend/testing-engine`, progress dashboard |

See [`docs/TASK_BOARD.md`](docs/TASK_BOARD.md) for the full sprint-by-sprint breakdown.

## Getting Started

```bash
git clone <your-repo-url>
cd cloudmentor-ai

# each service has its own README with setup instructions
# frontend: cd frontend && npm install && npm run dev
```

## Branching Strategy

- `main` — always deployable, protected, merge via PR only
- `dev` — integration branch, merge feature branches here first
- `feature/<module>-<short-description>` — e.g. `feature/workspace-autostop`, `feature/ai-buddy-recommendation`

Open a PR into `dev`, get at least one review from another teammate, then the lead merges `dev` → `main` at the end of each sprint.

## Tech Stack (proposed)

- **Frontend:** React + Tailwind
- **Backend:** Node.js/Express (or FastAPI for the AI/testing services)
- **AI Buddy:** Claude/OpenAI API + a vector DB (Pinecone/Weaviate) for grounding answers in course content
- **Workspace sandboxing:** Docker containers (per-user, ephemeral)
- **Database:** PostgreSQL (users, tests, sessions) + Redis (workspace idle-timers, cache)
- **Real-time chat:** Socket.io

## License

Add a license once you've decided (MIT is common for academic projects).
