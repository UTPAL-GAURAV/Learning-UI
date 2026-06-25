export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  level: string
  learningGoal: string
}

export interface QAItem {
  id: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  attempts: { timestamp: string; correct: boolean }[]
  wrongCount: number
  lastReviewed: string | null
}

export interface PendingTopic {
  subTopic: string
  reason: string
  suggestedPlacement: string
}

export interface Session {
  id: string
  topic: string
  topicSlug: string
  createdAt: string
  updatedAt: string
  notes: string
  keyConcepts: string[]
  qa: QAItem[]
  readinessScore: number
  sessionCount: number
  syllabusTopics?: string[]
  coveredTopics?: string[]
  pendingTopics?: PendingTopic[]
}

export interface WeakArea {
  id: string
  topicSlug: string
  subTopic: string
  description: string
  lastUpdated: string
}

export interface ScoreEntry {
  topic: string
  date: string
  score: number
  note: string
}

export interface SessionIndexEntry {
  topicSlug: string
  topic: string
  updatedAt: string
  readinessScore: number
  sessionCount: number
  syllabusProgress?: number
}
