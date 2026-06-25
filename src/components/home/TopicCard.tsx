import { Link } from 'react-router-dom'
import type { SessionIndexEntry, ScoreEntry } from '../../types'
import { formatRelative } from '../../lib/utils'
import { getScoreLabel, getScoreTextColor, getScoreBarColor } from '../../lib/scoring'

interface SparklineProps {
  entries: ScoreEntry[]
}

function Sparkline({ entries }: SparklineProps) {
  if (entries.length < 2) return null
  const last6 = entries.slice(-6)
  const W = 80
  const H = 28
  const PAD = 3
  const xs = last6.map((_, i) => PAD + (i / (last6.length - 1)) * (W - PAD * 2))
  const ys = last6.map(e => H - PAD - ((e.score / 100) * (H - PAD * 2)))

  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ')

  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={2} fill="#7c3aed" />
      ))}
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

  return (
    <Link
      to={`/session/${session.topicSlug}`}
      className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-700 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">{session.topic}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${labelClass}`}>{label}</span>
      </div>

      <div className={`text-3xl font-semibold mb-3 ${scoreColor}`}>
        {score}%
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">Readiness</div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${Math.min(session.readinessScore, 100)}%` }}
            />
          </div>
        </div>
        {progress > 0 && (
          <div>
            <div className="text-xs text-slate-400 mb-1">Coverage</div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-400 transition-all"
                style={{ width: `${Math.min(progress * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="flex gap-3 text-xs text-slate-400">
          <span>{session.sessionCount} Q&amp;A</span>
          <span>{formatRelative(session.updatedAt)}</span>
        </div>
        <Sparkline entries={scores} />
      </div>
    </Link>
  )
}
