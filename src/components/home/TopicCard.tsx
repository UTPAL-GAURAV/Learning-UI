import { Link } from 'react-router-dom'
import { MessageSquare, Layers, Clock } from 'lucide-react'
import type { SessionIndexEntry, ScoreEntry } from '../../types'
import { formatRelative } from '../../lib/utils'
import { getScoreLabel, getScoreTextColor, getScoreBarColor } from '../../lib/scoring'

function Sparkline({ entries }: { entries: ScoreEntry[] }) {
  if (entries.length < 2) return null
  const last6 = entries.slice(-6)
  const W = 120, H = 28, PAD = 3
  const xs = last6.map((_, i) => PAD + (i / (last6.length - 1)) * (W - PAD * 2))
  const ys = last6.map(e => H - PAD - ((e.score / 100) * (H - PAD * 2)))
  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline points={xs.map((x, i) => `${x},${ys[i]}`).join(' ')} fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={2.5} fill="#7c3aed" />)}
    </svg>
  )
}

interface Props {
  session: SessionIndexEntry
  scores?: ScoreEntry[]
}

export default function TopicCard({ session, scores = [] }: Props) {
  const score = session.readinessScore ?? 0
  const { label, className: labelClass } = getScoreLabel(score)
  const scoreColor = getScoreTextColor(score)
  const barColor = getScoreBarColor(score)
  const progress = session.syllabusProgress ?? 0
  const total = session.totalTopics ?? 0
  const covered = total > 0 ? Math.round(progress * total) : 0

  return (
    <Link
      to={`/session/${session.topicSlug}`}
      className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-violet-700 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="font-bold text-white text-base leading-snug">{session.topic}</h3>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${labelClass}`}>{label}</span>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
        <span className="text-sm text-slate-500">/100</span>
      </div>

      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Readiness</span><span>{score}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(score, 100)}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Coverage</span><span>{total > 0 ? `${covered}/${total}` : '—'}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {scores.length >= 2 && <div className="mb-3"><Sparkline entries={scores} /></div>}

      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><MessageSquare size={11} />{session.sessionCount} Q&amp;A</span>
        {session.conceptCount != null && (
          <span className="flex items-center gap-1"><Layers size={11} />{session.conceptCount} concepts</span>
        )}
        <span className="flex items-center gap-1"><Clock size={11} />{formatRelative(session.updatedAt)}</span>
      </div>
    </Link>
  )
}
