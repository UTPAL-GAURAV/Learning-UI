import type { UserProfile, Session, SessionIndexEntry, WeakArea, ScoreEntry } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

function getToken(): string | null {
  return localStorage.getItem('LEARNING_TOKEN')
}

async function apiFetch<T>(path: string): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (res.status === 401) {
    localStorage.removeItem('LEARNING_TOKEN')
    window.location.reload()
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  me: () => apiFetch<UserProfile>('/api/me'),
  sessions: () => apiFetch<SessionIndexEntry[]>('/api/sessions'),
  session: (slug: string) => apiFetch<Session>(`/api/sessions/${slug}`),
  scores: (slug: string) => apiFetch<ScoreEntry[]>(`/api/sessions/${slug}/scores`),
  weakAreas: () => apiFetch<WeakArea[]>('/api/weak-areas'),
  googleAuthUrl: () => `${API_URL}/auth/google`,
}
