# Task Board — CloudMentor AI

Copy this into GitHub Projects (Board view) once the repo is live: create one column per status (`Backlog`, `In Progress`, `In Review`, `Done`) and one card per row below.

## Sprint 0 — Setup (Week 1)

| Task | Owner | Notes |
|---|---|---|
| Repo created, teammates added, branch protection on `main` | Lead | |
| Project board set up in GitHub Projects | Lead | |
| Tech stack finalized, `docs/ARCHITECTURE.md` filled in | Lead | |
| Figma/wireframes for all 3 modules | Whole team | Can reuse the HTML prototype as a base |
| Dev environment + `.env.example` for each service | Each owner | |

## Sprint 1 — Core Module Skeletons (Weeks 2–3)

| Task | Owner |
|---|---|
| User auth (signup/login, student vs mentor role) | Lead |
| Workspace: spin up a basic container (Python only, no auto-stop yet) | Teammate A |
| Workspace: file save/resume to storage | Teammate A |
| Exchange: student & mentor profile CRUD | Teammate B |
| Exchange: skill tagging + search by skill | Teammate B |
| Testing: basic quiz model (question bank, submit, auto-score for MCQs) | Teammate C |
| AI Buddy: chat endpoint wired to Claude/OpenAI API (no personalization yet) | Lead |

## Sprint 2 — Module Depth (Weeks 4–5)

| Task | Owner |
|---|---|
| Workspace: add Java/C++/Linux environments, auto-stop idle sessions | Teammate A |
| Workspace: send runtime errors to AI Buddy endpoint | Teammate A + Lead |
| Exchange: booking flow + calendar slots | Teammate B |
| Exchange: real-time chat (Socket.io) | Teammate B |
| Testing: weak-topic detection (tag questions by topic, compute per-topic accuracy) | Teammate C |
| Testing: schedule regular tests (e.g. after every N practice sessions) | Teammate C |
| AI Buddy: recommend next topic based on test results + practice activity | Lead |

## Sprint 3 — The Loop (Weeks 6–7)

*This is the sprint that makes it "CloudMentor AI" and not three separate apps — prioritize it.*

| Task | Owner |
|---|---|
| AI Buddy: escalation rule — if a student fails/struggles on a topic N times, auto-suggest a mentor from Exchange | Lead + Teammate C |
| AI Buddy: explain test mistakes in plain language, not just "wrong answer" | Lead |
| Progress dashboard: skill-track bars, badges, weekly AI-generated report | Teammate C |
| Cross-module integration testing (Workspace → AI Buddy → Exchange handoff) | Whole team |
| Bug bash + UI polish | Whole team |

## Sprint 4 — Polish & Demo Prep (Week 8)

| Task | Owner |
|---|---|
| Deploy (Vercel/Render/Railway for demo purposes) | Lead |
| Seed demo data (fake students, mentors, test history) | Whole team |
| Record demo video / prepare live-demo script | Lead |
| Final README, architecture diagram, PPT | Whole team |

---

## Definition of Done (apply to every task)

- Code merged into `dev` via PR with at least one review
- No console errors on the happy path
- README in that service updated if setup steps changed
