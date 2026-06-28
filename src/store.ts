import { create } from 'zustand'
import { api } from './lib/api'
import type { UserProfile, Session, SessionIndexEntry, WeakArea, ScoreEntry } from './types'

interface AppState {
  me: UserProfile | null
  sessions: SessionIndexEntry[]
  fullSessions: Record<string, Session>
  weakAreas: WeakArea[]
  scoreHistory: Record<string, ScoreEntry[]>
  loaded: boolean
  load: () => Promise<void>
  loadSession: (topicSlug: string) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  me: null,
  sessions: [],
  fullSessions: {},
  weakAreas: [],
  scoreHistory: {},
  loaded: false,

  async load() {
    const [me, sessions, weakAreas] = await Promise.all([
      api.me(),
      api.sessions(),
      api.weakAreas(),
    ])
    set({ me, sessions, weakAreas, loaded: true })
  },

  async loadSession(topicSlug) {
    const existing = get().fullSessions[topicSlug]
    const existingScores = get().scoreHistory[topicSlug]
    if (existing && existingScores) return

    const [session, scores, cards] = await Promise.all([
      api.session(topicSlug),
      api.scores(topicSlug),
      api.cards(topicSlug),
    ])
    const sessionWithCards = { ...session, qa: cards }
    set(state => ({
      fullSessions: { ...state.fullSessions, [topicSlug]: sessionWithCards },
      scoreHistory: { ...state.scoreHistory, [topicSlug]: scores },
    }))
  },
}))
