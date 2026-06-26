# Learning UI

A VS Code + Claude learning workflow. Claude teaches, asks scenario questions, and tracks progress via MCP tools. This UI displays that data — read-only.

## One-time setup

Run the setup script — registers you with the backend (ONE TIME ONLY):

```bash
npx github:UTPAL-GAURAV/Learning-Service
```

It opens a Google login, asks your name, role, and learning goal. Done in ~2 minutes.

Open the dashboard: https://learning-ui-indol.vercel.app

## Every session after that

No commands to run. The MCP server starts automatically when Claude Code starts.

1. Open this folder in your Claude Code client of choice (CLI, VS Code extension, or desktop app)
2. Start a new conversation
3. Type: `Start a learning session on [topic]`
4. Claude teaches, asks scenario questions, and tracks your progress automatically
5. Refresh the browser to see your dashboard update live

> **You must open this folder** — Claude Code reads `.claude/settings.json` from the project root to connect the MCP server. Running `claude` from a different directory won't have the learning tools available.

## How it works

Claude reads `CLAUDE.md` at the start of every session. That file tells it:
- Which MCP tools to use for reading/writing session data
- How to adapt teaching to your role and level
- How to run test mode (`"test me"` triggers a mock interview)
- Scoring rules, Q&A card format, notes format

All data is isolated per Google account and stored in the hosted backend.

## Auth

On first load the app checks `localStorage` for `LEARNING_TOKEN`. If missing, it shows a Google login that redirects through OAuth. The backend mints a JWT and redirects back to `/#token=<jwt>` — the app stores it and reloads. All API calls include `Authorization: Bearer <token>`. A 401 clears the token and returns to the login screen.

## Deploying to Vercel

Vercel auto-detects Vite at the repo root. The `.env` is committed so no environment variable setup is needed.
