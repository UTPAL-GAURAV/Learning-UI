# learning-ui

Read-only React UI for the VS Code + Claude learning workflow. Claude writes all session data via MCP tools; this app only reads and displays it.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + `@tailwindcss/typography`
- Zustand (state)
- React Router v6
- `lucide-react`, `marked`

## Setup

```bash
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL
npm install
npm run dev
```

## Environment

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `https://my-backend.vercel.app` |

## Auth flow

1. On load, the app checks `localStorage` for `LEARNING_TOKEN`.
2. If missing, it shows a login screen with a **Login with Google** button that redirects to `GET <API_URL>/auth/google`.
3. After OAuth completes, the backend redirects back to `/#token=<jwt>`. The app stores the token and reloads.
4. All API requests include `Authorization: Bearer <token>`. A 401 response clears the token and returns to the login screen.

## Pages

- `/` — Home: stats, weak areas summary, topic grid
- `/session/:topicSlug` — Session detail: notes, key concepts, Q&A accordion, readiness panel, score history chart

## Project structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── store.ts                  # Zustand store
├── types/index.ts            # All shared types
├── lib/
│   ├── api.ts                # Fetch helpers with Bearer token
│   ├── utils.ts              # Date formatting
│   ├── scoring.ts            # Score → color/label helpers
│   └── theme.ts              # Dark mode toggle, persisted to localStorage
├── pages/
│   ├── LoginPage.tsx
│   ├── HomePage.tsx
│   └── SessionPage.tsx
└── components/
    ├── home/
    │   ├── TopicCard.tsx
    │   ├── TopicGrid.tsx
    │   └── WeakAreasSummary.tsx
    └── session/
        ├── NotesViewer.tsx
        ├── KeyConceptsList.tsx
        ├── QAList.tsx
        ├── ReadinessPanel.tsx
        ├── ScoreHistoryChart.tsx
        └── PendingTopicsPanel.tsx
```

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Type-check + production build
npm run preview  # Preview production build locally
```
