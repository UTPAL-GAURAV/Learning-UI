import { Target } from 'lucide-react'
import type { Session } from '../../types'
import { getScoreTextColor, getScoreBarColor, getScoreLabel } from '../../lib/scoring'

interface Props {
  session: Session
}

export default function ReadinessPanel({ session }: Props) {
  const scoreColor = getScoreTextColor(session.readinessScore)
  const barColor = getScoreBarColor(session.readinessScore)
  const { label } = getScoreLabel(session.readinessScore)

  const totalAttempts = session.qa.reduce((acc, c) => acc + (c.attempts?.length ?? 0), 0)
  const correctFirst = session.qa.filter(c => c.attempts?.[0]?.correct).length
  const concepts = session.keyConcepts?.length ?? 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-violet-500" />
        <h2 className="font-semibold text-white text-sm">Interview Readiness</h2>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className={`text-4xl font-bold ${scoreColor}`}>{session.readinessScore}</span>
        <span className="text-slate-500 text-sm">/100 — {label}</span>
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.min(session.readinessScore, 100)}%` }}
        />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Q&amp;A practiced</span>
          <span className="text-slate-300">{totalAttempts}/{session.qa.length}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Correct on first try</span>
          <span className="text-slate-300">{correctFirst}/{session.qa.length}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Concepts covered</span>
          <span className="text-slate-300">{concepts}</span>
        </div>
      </div>
    </div>
  )
}
