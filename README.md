
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

AI Buddy + Testing Engine (the current working loop):

```bash
# terminal 1
cd backend/ai-buddy-service
cp .env.example .env   # set JWT_SECRET and GEMINI_API_KEY
npm install
npm run dev            # http://localhost:4000

# terminal 2
cd backend/testing-engine
cp .env.example .env   # use the SAME JWT_SECRET as ai-buddy-service
npm install
npm run dev            # http://localhost:4001
```

Then open `frontend/ai-buddy-live.html` in a browser: sign up, take a quiz, check Progress, then Chat. If you miss questions, Buddy explains them; if a topic stays below 60 after 3+ attempts, asking for help flags a mentor.

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

# ☁️ CloudMentor AI

> An intelligent cloud-based learning, coding, and mentorship platform that combines a cloud workspace, AI-powered guidance, and peer-to-peer skill exchange in one unified environment.

## 📌 Overview

CloudMentor AI is designed to make technical learning more accessible, personalized, and collaborative.

Traditional learning platforms often separate coding environments, learning resources, AI assistance, and mentorship. CloudMentor AI brings these capabilities together into a single platform where users can:

- Practice coding in a cloud-based workspace
- Get instant assistance from an AI-powered mentor
- Discover and connect with skilled peers and mentors
- Track their learning progress
- Receive personalized learning recommendations
- Participate in assessments and skill development activities

The platform aims to create a continuous learning cycle where users **learn → practice → receive feedback → connect with mentors → track progress → improve**.

---

## 🎯 Problem Statement

Students and aspiring developers often face several challenges while learning technical skills:

- Setting up development environments can be difficult.
- Learning resources are scattered across different platforms.
- Beginners may struggle to understand and debug errors.
- Finding the right mentor for a specific skill is difficult.
- There is limited personalized guidance based on individual progress.
- Learners often lack a structured way to monitor their improvement.

**CloudMentor AI** addresses these challenges by providing a unified cloud-based environment for learning, coding, AI assistance, and mentorship.

---

## 💡 Solution

CloudMentor AI provides three major components:

### ☁️ 1. Cloud Workspace

A browser-based development environment that allows users to practice and build projects without depending completely on local system configuration.

**Key capabilities:**

- Cloud-based coding environment
- Web development support
- Linux terminal access
- Project storage
- Automatic cloud-based saving
- Containerized development environment
- Secure workspace management
- Reduced dependency on local machine setup

---

### 🤖 2. AI Buddy

AI Buddy acts as a personalized virtual mentor for the learner.

It can help users with:

- Answering technical questions
- Explaining programming concepts
- Understanding error messages
- Debugging code
- Reviewing code
- Identifying weak areas
- Recommending learning resources
- Suggesting projects and exercises
- Creating personalized learning paths
- Providing continuous learning guidance

The AI Buddy uses the learner's interaction and progress information to provide more relevant recommendations.

---

### 🤝 3. Skill Exchange

The Skill Exchange module enables learners to connect with people who have expertise in a particular skill.

Users can:

- Create skill-based profiles
- Search for mentors
- Discover people based on their skills
- View mentor availability
- Send mentorship requests
- Schedule learning sessions
- Communicate with mentors
- Provide ratings and feedback
- Participate in peer-to-peer learning

This creates a collaborative ecosystem where users can both **learn from others and share their own skills**.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| ☁️ Cloud Workspace | Browser-based coding and development environment |
| 💻 Online IDE | Practice and build projects without extensive local setup |
| 🖥️ Linux Terminal | Execute commands in a cloud environment |
| 🤖 AI Buddy | AI-powered learning and coding assistance |
| 🐞 Code Debugging | Helps identify and understand programming errors |
| 📚 Learning Paths | Personalized recommendations based on progress |
| 🤝 Skill Exchange | Connect with mentors and peers |
| 👨‍🏫 Mentor Matching | Find mentors based on required skills |
| 📅 Session Scheduling | Schedule mentorship and learning sessions |
| 📊 Progress Tracking | Monitor learning activities and improvement |
| 📝 Assessments | Evaluate skills and identify weak areas |
| 🔔 Notifications | Notify users about important learning activities |
| ☁️ Cloud Storage | Store projects and learning data securely |
| 🔐 Authentication | Secure user authentication and profiles |

---

## 🔄 System Workflow

```text
                    ┌──────────────────┐
                    │      User        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Authentication   │
                    │ & User Profile   │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Cloud Workspace    │
                  │ Coding + Terminal    │
                  └──────────┬───────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     AI Buddy     │
                    │ Guidance/Review  │
                    └────────┬─────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
       ┌──────────────────┐    ┌──────────────────┐
       │ Progress &       │    │ Skill Exchange   │
       │ Assessments      │    │ Mentor Matching  │
       └────────┬─────────┘    └────────┬─────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                 ┌──────────────────────┐
                 │ Personalized Learning│
                 │ Recommendations      │
                 └──────────────────────┘

