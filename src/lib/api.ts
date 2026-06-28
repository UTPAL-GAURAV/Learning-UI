import type { UserProfile, Session, SessionIndexEntry, WeakArea, QAItem } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const RETRY_DELAYS = [3000, 6000, 15000] // Render cold start can take up to ~30s total

function getToken(): string | null {
  return localStorage.getItem('LEARNING_TOKEN')
}

async function apiFetch<T>(path: string): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const res = await fetch(`${API_URL}${path}`, { headers })

      if (res.status === 401) {
        localStorage.removeItem('LEARNING_TOKEN')
        localStorage.setItem('token_expired', 'true')
        window.location.reload()
        throw new Error('Unauthorized')
      }

      // 5xx = server waking up, retry
      if (res.status >= 500 && attempt < RETRY_DELAYS.length) {
        await sleep(RETRY_DELAYS[attempt])
        continue
      }

      if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
      return res.json()
    } catch (err) {
      // Network error (fetch threw) = server sleeping, retry
      if (err instanceof TypeError && attempt < RETRY_DELAYS.length) {
        await sleep(RETRY_DELAYS[attempt])
        continue
      }
      throw err
    }
  }

  throw new Error(`Backend unavailable after retries: ${path}`)
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (res.status === 401) {
    localStorage.removeItem('LEARNING_TOKEN')
    localStorage.setItem('token_expired', 'true')
    window.location.reload()
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}


async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  })
  if (res.status === 401) {
    localStorage.removeItem('LEARNING_TOKEN')
    localStorage.setItem('token_expired', 'true')
    window.location.reload()
    throw new Error('Unauthorized')
  }
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function mapSessionIndex(s: Record<string, unknown>): SessionIndexEntry {
  const syllabusTopics = (s.syllabus_topics as string[]) ?? []
  const coveredTopics = (s.covered_topics as string[]) ?? []
  const keyConcepts = (s.key_concepts as string[]) ?? []
  const total = syllabusTopics.length
  const covered = coveredTopics.length
  return {
    topicSlug: s.topic_slug as string,
    topic: s.topic_name as string,
    updatedAt: s.updated_at as string,
    readinessScore: (s.readiness_score as number) ?? 0,
    sessionCount: parseInt(String(s.qa_count ?? '0'), 10),
    syllabusProgress: total > 0 ? covered / total : undefined,
    totalTopics: total > 0 ? total : undefined,
    conceptCount: keyConcepts.length > 0 ? keyConcepts.length : undefined,
  }
}

function mapSession(s: Record<string, unknown>): Session {
  return {
    id: s.id as string,
    topic: s.topic_name as string,
    topicSlug: s.topic_slug as string,
    createdAt: s.created_at as string,
    updatedAt: s.updated_at as string,
    notes: (s.notes as string) ?? '',
    keyConcepts: (s.key_concepts as string[]) ?? [],
    qa: ((s.qa_cards ?? s.qa ?? s.cards) as Session['qa']) ?? [],
    readinessScore: (s.readiness_score as number) ?? 0,
    sessionCount: parseInt(String(s.qa_count ?? '0'), 10),
    syllabusTopics: s.syllabus_topics as string[] | undefined,
    coveredTopics: s.covered_topics as string[] | undefined,
    pendingTopics: s.pending_topics as Session['pendingTopics'] | undefined,
  }
}

function mapWeakArea(w: Record<string, unknown>): WeakArea {
  return {
    id: w.id as string,
    topicSlug: w.topic_slug as string,
    subTopic: w.sub_topic as string,
    description: (w.description as string) ?? '',
    lastUpdated: w.last_updated as string,
    questionId: w.question_id as string | undefined,
    question: w.question as string | undefined,
    wrongCount: (w.wrong_count as number) ?? 0,
    flaggedForReview: (w.flagged_for_review as boolean) ?? false,
  }
}

function mapCard(c: Record<string, unknown>): QAItem {
  return {
    id: c.id as string,
    question: c.question as string,
    answer: c.answer as string,
    difficulty: c.difficulty as QAItem['difficulty'],
    tags: (c.tags as string[]) ?? [],
    attempts: (c.attempts as QAItem['attempts']) ?? [],
    wrongCount: (c.wrong_count as number) ?? 0,
    lastReviewed: (c.last_reviewed as string | null) ?? null,
  }
}

export const api = {
  me: () => apiFetch<UserProfile>('/api/me'),
  sessions: () => apiFetch<Record<string, unknown>[]>('/api/sessions').then(r => Array.from(r).map(mapSessionIndex)),
  session: (slug: string) => apiFetch<Record<string, unknown>>(`/api/sessions/${slug}`).then(mapSession),
  patchSession: (slug: string, patch: Record<string, unknown>) => apiPatch<Record<string, unknown>>(`/api/sessions/${slug}`, patch),
  cards: (slug: string) => apiFetch<Record<string, unknown>[]>(`/api/sessions/${slug}/cards`).then(r => Array.from(r).map(mapCard)),
  addCard: (slug: string, card: Omit<QAItem, 'attempts' | 'wrongCount' | 'lastReviewed'> & { id: string }) =>
    apiPost<Record<string, unknown>>(`/api/sessions/${slug}/cards`, card).then(mapCard),
  updateCard: (_id: string, _data: Partial<QAItem>): Promise<QAItem> =>
    Promise.reject(new Error('Edit cards not yet supported by the backend.')),
  deleteCard: (_id: string): Promise<void> =>
    Promise.reject(new Error('Delete cards not yet supported by the backend.')),
  deleteSession: async (slug: string): Promise<void> => {
    const token = getToken()
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
    const res = await fetch(`${API_URL}/api/sessions/${slug}`, { method: 'DELETE', headers })
    if (res.status === 401) { localStorage.removeItem('LEARNING_TOKEN'); localStorage.setItem('token_expired', 'true'); window.location.reload(); throw new Error('Unauthorized') }
    if (!res.ok && res.status !== 204) throw new Error(`Failed to delete session: ${res.status}`)
  },
  scores: (slug: string) => apiFetch<import('../types').ScoreEntry[]>(`/api/sessions/${slug}/scores`),
  weakAreas: (topic?: string) => apiFetch<Record<string, unknown>[]>(`/api/weak-areas${topic ? `?topic=${topic}` : ''}`).then(r => Array.from(r).map(mapWeakArea)),
  googleAuthUrl: () => `${API_URL}/auth/google`,
}
