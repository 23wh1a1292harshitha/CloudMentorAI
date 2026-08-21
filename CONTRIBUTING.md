# Contributing

## Workflow

1. Pull the latest `dev`: `git checkout dev && git pull`
2. Create a feature branch: `git checkout -b feature/<module>-<short-description>`
   - e.g. `feature/workspace-autostop`, `feature/exchange-booking-modal`
3. Commit with clear messages: `git commit -m "Add auto-stop timer to workspace service"`
4. Push and open a PR **into `dev`** (not `main`)
5. Tag one teammate for review
6. Once approved, merge — lead merges `dev` → `main` at the end of each sprint

## Commit message style

`<type>: <short description>`

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Example: `feat: add weak-topic detection to testing engine`

## Before opening a PR

- [ ] Code runs locally without errors
- [ ] No secrets/API keys committed (check `.env` is gitignored)
- [ ] Updated relevant README/docs if setup changed
