# Project Overview

A VS Code + Claude workflow for structured interview and topic prep. Claude acts as a personalized tutor inside VS Code, and this dashboard shows the learner's progress.

## What problem it solves

Most learning tools are passive — you watch or read. This makes Claude actively teach: scenario questions, gap analysis, mock tests. Everything is tracked automatically so progress persists across sessions and you can see it in one place.

## How the pieces fit together

```
VS Code + Claude  ──MCP tools──▶  Render backend  ──▶  Postgres DB
                                        │
                              Google OAuth (JWT)
                                        │
                        ┌───────────────┴───────────────┐
                        ▼                               ▼
              Browser login                        CLI login
      /#token=<jwt> → learning-ui            localhost:<port>/callback
```

### 1. This repo — `learning-ui`
React 19 + Vite dashboard hosted on Vercel. **Read-only.** Fetches session data from the REST API and displays topics, Q&A cards, readiness scores, weak areas, and score history charts. Auth via Google OAuth JWT stored in `localStorage`.

### 2. Backend — `learning-service` (Render)
REST API that owns all data. Handles Google OAuth with two flows:
- **Browser flow** → redirects to `https://learning-ui-indol.vercel.app/#token=<jwt>`
- **CLI flow** → redirects to `http://localhost:<dynamic-port>/callback?token=<jwt>`

### 3. Setup CLI — `npx github:UTPAL-GAURAV/Learning-Service`
One-time setup per user:
1. Opens Google login in the browser
2. Captures JWT via a temporary local HTTP server
3. Prompts for name, role, level, learning goal
4. Saves `~/.learning-service/config.json`
5. Auto-writes the MCP server config into VS Code settings

### 4. MCP server — `--mcp` flag on the CLI
Runs locally inside VS Code. Reads the JWT from `~/.learning-service/config.json` and exposes 11 tools to Claude over stdio. Each tool makes a credentialed REST call to the backend.

### 5. `CLAUDE.md` — teaching instructions
Auto-loaded by Claude at the start of every session in this repo. Tells Claude how to teach (intro → explain → scenario question → evaluate), when to call which MCP tool, how test mode works, scoring rules, and Q&A card format. **This is not user-facing docs — it's runtime instructions for Claude.**

## User flow

```
1. Clone repo + run setup CLI once  →  auth + MCP configured
2. Open folder in VS Code  →  start Claude session
3. "Start a learning session on [topic]"
4. Claude teaches, tracks scores and Q&A silently via MCP tools
5. Open dashboard (npm run dev) to see progress
```

## Key URLs

| | URL |
|---|---|
| Frontend | https://learning-ui-indol.vercel.app |
| Backend | https://learning-service-yys6.onrender.com |
| Repo | https://github.com/UTPAL-GAURAV/Learning-UI |

## Data isolation

Each user's data is scoped to their Google account. Multiple people can use the same repo and backend — everyone sees only their own sessions.
