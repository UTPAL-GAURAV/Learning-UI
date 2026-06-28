import { useState } from 'react'
import { BookOpen, Sun, Moon, Copy, Check } from 'lucide-react'
import { useStore } from '../store'
import { toggleTheme, getTheme } from '../lib/theme'
import { getScoreTextColor } from '../lib/scoring'
import TopicGrid from '../components/home/TopicGrid'
import WeakAreasSummary from '../components/home/WeakAreasSummary'

export default function HomePage() {
  const { me, sessions, weakAreas } = useStore()
  const [theme, setTheme] = useState(getTheme())
  const [copied, setCopied] = useState(false)

  function handleCopyToken() {
    const token = localStorage.getItem('LEARNING_TOKEN')
    if (!token) return
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleToggleTheme() {
    setTheme(toggleTheme())
  }

  const totalQA = sessions.reduce((acc, s) => acc + (s.sessionCount ?? 0), 0)
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.readinessScore ?? 0), 0) / sessions.length)
    : 0
  const readyCount = sessions.filter(s => s.readinessScore >= 75).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-10 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2 text-violet-600 flex-1">
          <BookOpen size={20} />
          <span className="font-semibold text-slate-800 dark:text-slate-100">Learning</span>
        </div>
        <button
          onClick={handleCopyToken}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Copy auth token for Claude"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy token'}
        </button>
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {me && (
          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-medium">
            {me.name}
          </span>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="text-xs text-slate-400 font-medium mb-1">Topics</div>
              <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{sessions.length}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Q&A</div>
              <div className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{totalQA}</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <div className="text-xs text-slate-400 font-medium mb-1">Avg Readiness</div>
              <div className={`text-2xl font-semibold ${getScoreTextColor(avgScore)}`}>{avgScore}%</div>
              <div className="text-xs text-slate-400 mt-0.5">{readyCount} topic{readyCount !== 1 ? 's' : ''} ≥ 75</div>
            </div>
          </div>
        )}

        {weakAreas.length > 0 && <WeakAreasSummary weakAreas={weakAreas} />}

        <TopicGrid sessions={sessions} />
      </main>
    </div>
  )
}
