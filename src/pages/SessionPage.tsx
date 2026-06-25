import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { useStore } from '../store'
import { toggleTheme, getTheme } from '../lib/theme'
import { formatDate } from '../lib/utils'
import NotesViewer from '../components/session/NotesViewer'
import KeyConceptsList from '../components/session/KeyConceptsList'
import QAList from '../components/session/QAList'
import ReadinessPanel from '../components/session/ReadinessPanel'
import ScoreHistoryChart from '../components/session/ScoreHistoryChart'
import PendingTopicsPanel from '../components/session/PendingTopicsPanel'

export default function SessionPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  const navigate = useNavigate()
  const { loadSession, fullSessions, scoreHistory } = useStore()
  const [theme, setTheme] = useState(getTheme())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!topicSlug) return
    setLoading(true)
    loadSession(topicSlug).finally(() => setLoading(false))
  }, [topicSlug])

  const session = topicSlug ? fullSessions[topicSlug] : undefined
  const scores = topicSlug ? (scoreHistory[topicSlug] ?? []) : []

  function handleToggleTheme() {
    setTheme(toggleTheme())
  }

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading session…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="font-semibold text-slate-800 dark:text-slate-100 flex-1 truncate">{session.topic}</span>
        <span className="text-xs text-slate-400">Last updated {formatDate(session.updatedAt)}</span>
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <NotesViewer notes={session.notes} />
          {session.keyConcepts.length > 0 && <KeyConceptsList concepts={session.keyConcepts} />}
          <QAList items={session.qa} />
        </div>

        <aside className="w-72 shrink-0 space-y-4">
          <ReadinessPanel session={session} />
          <ScoreHistoryChart scores={scores} />
          {session.pendingTopics && session.pendingTopics.length > 0 && (
            <PendingTopicsPanel topics={session.pendingTopics} />
          )}
        </aside>
      </main>
    </div>
  )
}
