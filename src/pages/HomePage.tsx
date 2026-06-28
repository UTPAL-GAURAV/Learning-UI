import { useState } from 'react'
import { BookOpen, Copy, Check, TrendingUp, Target, HelpCircle, X } from 'lucide-react'
import { useStore } from '../store'
import { getScoreTextColor } from '../lib/scoring'
import TopicGrid from '../components/home/TopicGrid'

function SetupModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-base">Setup & How to Use</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">1. Clone the repo</p>
            <code className="block bg-slate-800 text-sky-400 px-3 py-2 rounded-lg text-xs font-mono">
              git clone https://github.com/UTPAL-GAURAV/Learning-UI.git
            </code>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">2. Get your token</p>
            <p>Log in with Google above, then click <span className="text-white font-medium">Copy token</span> in the header.</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">3. Add token to .env</p>
            <code className="block bg-slate-800 text-sky-400 px-3 py-2 rounded-lg text-xs font-mono">
              LEARNING_TOKEN=&lt;paste token here&gt;
            </code>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">4. Start a session</p>
            <p>Open the cloned folder in Claude Code (CLI, VS Code extension, or desktop app) and say:</p>
            <code className="block bg-slate-800 text-emerald-400 px-3 py-2 rounded-lg text-xs font-mono mt-1">
              Start a learning session on [topic]
            </code>
          </div>
          <p className="text-slate-500 text-xs pt-1">
            Claude reads CLAUDE.md automatically — no extra setup needed. Refresh this dashboard to see progress update live.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { me, sessions } = useStore()
  const [copied, setCopied] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  function handleCopyToken() {
    const token = localStorage.getItem('LEARNING_TOKEN')
    if (!token) return
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const totalQA = sessions.reduce((acc, s) => acc + (s.sessionCount ?? 0), 0)
  const avgScore = sessions.length
    ? Math.round(sessions.reduce((a, s) => a + (s.readinessScore ?? 0), 0) / sessions.length)
    : 0
  const readyCount = sessions.filter(s => s.readinessScore >= 75).length

  return (
    <div className="min-h-screen bg-slate-950">
      {showSetup && <SetupModal onClose={() => setShowSetup(false)} />}

      <header className="sticky top-0 z-10 h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-3">
        <div className="flex items-center gap-2 text-violet-500 flex-1">
          <BookOpen size={20} />
          <span className="font-semibold text-white">Learning</span>
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <HelpCircle size={14} />
          How to use
        </button>
        <button
          onClick={handleCopyToken}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Copy auth token for Claude"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy token'}
        </button>
        {me && (
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full font-medium">
            {me.name}
          </span>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen size={14} className="text-violet-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Topics</span>
              </div>
              <div className="text-4xl font-bold text-white">{sessions.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={14} className="text-violet-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Q&amp;A Cards</span>
              </div>
              <div className="text-4xl font-bold text-white">{totalQA}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Target size={14} className="text-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Readiness</span>
              </div>
              <div className={`text-4xl font-bold ${getScoreTextColor(avgScore)}`}>{avgScore}</div>
              <div className="text-xs text-slate-500 mt-1">{readyCount} topic{readyCount !== 1 ? 's' : ''} ≥ 75</div>
            </div>
          </div>
        )}

        <TopicGrid sessions={sessions} />
      </main>
    </div>
  )
}
