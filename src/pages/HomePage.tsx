import { useState } from 'react'
import { BookOpen, Copy, Check, TrendingUp, Target, HelpCircle, X, Brain, Layers, FileQuestion, RotateCcw, Sparkles } from 'lucide-react'
import { useStore } from '../store'
import { getScoreTextColor } from '../lib/scoring'
import TopicGrid from '../components/home/TopicGrid'

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-violet-400" />
            <h2 className="font-bold text-white text-base">What is this app?</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-500 mb-4">Your one-stop personalised learning companion</p>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">
          Most learners bounce between YouTube videos, blog posts, flashcard apps, and random mock tests — spending more time managing their prep than actually learning.
          <span className="text-white font-medium"> This app is the single place where everything lives:</span> your notes, your Q&amp;A cards, your weak spots, your progress — all tied to <em>you</em> and <em>your</em> goal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-violet-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Personalised teaching</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Claude knows your role, level, and goal. Every explanation, analogy, and example is tailored to you — an SDE-2 candidate gets system-design depth; a QA engineer gets test-design scenarios.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Structured syllabus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Just say "I want to learn Redis" — Claude designs the full syllabus for your level, walks you through each sub-topic in order, and keeps track of where you are. No more random rabbit holes.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileQuestion size={14} className="text-sky-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Application-first Q&amp;A</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every question is scenario-based or a trade-off — the kind that actually comes up in interviews. No "define X" cards. Each card is auto-generated per your topic and difficulty level.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Memory across sessions</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick up exactly where you left off — last score, deferred topics, flagged weak areas. No need to maintain notes manually. The app remembers everything between sessions.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-rose-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">Weak area tracking</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wrong answers are automatically flagged as weak areas. You can drill them any time, and the test mode biases toward gaps — so you're always working on what matters most.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-violet-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wide">One-stop dashboard</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No YouTube, no Notion, no random mock sites. Every topic you're learning lives here — with readiness scores, score history, notes, and Q&amp;A cards all in one place.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-5 leading-relaxed">
          <span className="text-slate-400 font-medium">How it works:</span> Open this repo in Claude Code, copy your token from the header, paste it in <code className="text-sky-400 bg-slate-800 px-1 rounded">.env</code> as <code className="text-sky-400 bg-slate-800 px-1 rounded">LEARNING_TOKEN=...</code>, and say <span className="text-emerald-400">"Start a learning session on [topic]"</span>. Claude reads CLAUDE.md automatically — no extra setup.
        </p>
      </div>
    </div>
  )
}

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
              git clone https://github.com/UTPAL-GAURAV/lumen.git
            </code>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">2. Get your token</p>
            <p>Copy token from the header button present in this UI.</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">3. Add token to .env</p>
            <p>Open the cloned repo (Lumen) in your VS Code and paste the token in .env file.</p>
            <code className="block bg-slate-800 text-sky-400 px-3 py-2 rounded-lg text-xs font-mono">
              LEARNING_TOKEN=&lt;paste token here&gt;
            </code>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">4. Start a session</p>
            <p>Open Claude Code CLI or VS Code extension or or desktop app and say (cli path must be Lumen):</p>
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
  const [showAbout, setShowAbout] = useState(false)

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

  const isEmpty = sessions.length === 0

  return (
    <div className="min-h-screen bg-slate-950">
      {showSetup && <SetupModal onClose={() => setShowSetup(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <header className="sticky top-0 z-10 h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
        <div className="flex items-center gap-2 text-violet-500 flex-1 min-w-0">
          <BookOpen size={20} className="shrink-0" />
          <span className="font-semibold text-white truncate">Learning</span>
        </div>
        {!isEmpty && (
          <>
            <button
              onClick={() => setShowAbout(true)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">About</span>
            </button>
            <button
              onClick={() => setShowSetup(true)}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
            >
              <HelpCircle size={14} />
              <span className="hidden sm:inline">How to use</span>
            </button>
          </>
        )}
        <button
          onClick={handleCopyToken}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
          title="Copy auth token for Claude"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy token'}</span>
        </button>
        {me && (
          <span className="hidden sm:inline text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-medium truncate max-w-[100px]">
            {me.name}
          </span>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {isEmpty ? (
          <div className="space-y-8">
            {/* What is this app */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-violet-400" />
                <h2 className="font-bold text-white text-base">What is this app?</h2>
              </div>
              <p className="text-xs text-slate-500 mb-4">Your one-stop personalised learning companion</p>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Most learners bounce between YouTube videos, blog posts, flashcard apps, and random mock tests — spending more time managing their prep than actually learning.
                <span className="text-white font-medium"> This app is the single place where everything lives:</span> your notes, your Q&amp;A cards, your weak spots, your progress — all tied to <em>you</em> and <em>your</em> goal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={14} className="text-violet-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">Personalised teaching</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Claude knows your role, level, and goal. Every explanation, analogy, and example is tailored to you — an SDE-2 candidate gets system-design depth; a QA engineer gets test-design scenarios.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={14} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">Structured syllabus</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Just say "I want to learn Redis" — Claude designs the full syllabus for your level, walks you through each sub-topic in order, and keeps track of where you are. No more random rabbit holes.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileQuestion size={14} className="text-sky-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">Application-first Q&amp;A</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every question is scenario-based or a trade-off — the kind that actually comes up in interviews. No "define X" cards. Each card is auto-generated per your topic and difficulty level.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">Memory across sessions</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pick up exactly where you left off — last score, deferred topics, flagged weak areas. No need to maintain notes manually. The app remembers everything between sessions.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={14} className="text-rose-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">Weak area tracking</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Wrong answers are automatically flagged as weak areas. You can drill them any time, and the test mode biases toward gaps — so you're always working on what matters most.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-violet-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">One-stop dashboard</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No YouTube, no Notion, no random mock sites. Every topic you're learning lives here — with readiness scores, score history, notes, and Q&amp;A cards all in one place.
                  </p>
                </div>
              </div>
            </div>

            {/* How to use */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle size={15} className="text-violet-400" />
                <h2 className="font-bold text-white text-base">How to get started</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">1. Clone the repo</p>
                  <code className="block bg-slate-800 text-sky-400 px-3 py-2 rounded-lg text-xs font-mono break-all">
                    git clone https://github.com/UTPAL-GAURAV/lumen.git
                  </code>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">2. Get your token</p>
                  <p className="text-slate-400 text-sm">Click <span className="text-white font-medium">Copy token</span> in the header above.</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">3. Add token to .env</p>
                  <p className="text-slate-400 text-sm mb-2">Open the cloned repo in VS Code and paste the token in <code className="text-sky-400 bg-slate-800 px-1 rounded">.env</code>:</p>
                  <code className="block bg-slate-800 text-sky-400 px-3 py-2 rounded-lg text-xs font-mono">
                    LEARNING_TOKEN=&lt;paste token here&gt;
                  </code>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">4. Start a session</p>
                  <p className="text-slate-400 text-sm mb-2">Open Claude Code (CLI, VS Code extension, or desktop app) with the Lumen repo and say:</p>
                  <code className="block bg-slate-800 text-emerald-400 px-3 py-2 rounded-lg text-xs font-mono">
                    Start a learning session on [topic]
                  </code>
                </div>
                <p className="text-slate-500 text-xs pt-1">
                  Claude reads CLAUDE.md automatically — no extra setup needed. Refresh this page to see your topics appear.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen size={14} className="text-violet-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">Topics</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{sessions.length}</div>
                <div className="text-xs text-slate-500 sm:hidden mt-0.5">Topics</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={14} className="text-violet-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">Q&amp;A Cards</span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{totalQA}</div>
                <div className="text-xs text-slate-500 sm:hidden mt-0.5">Q&amp;A</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Target size={14} className="text-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">Avg Readiness</span>
                </div>
                <div className={`text-3xl sm:text-4xl font-bold ${getScoreTextColor(avgScore)}`}>{avgScore}</div>
                <div className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                  <span className="sm:hidden">Avg </span>
                  {readyCount} topic{readyCount !== 1 ? 's' : ''} ≥ 75
                </div>
              </div>
            </div>
            <TopicGrid sessions={sessions} />
          </>
        )}
      </main>
    </div>
  )
}
