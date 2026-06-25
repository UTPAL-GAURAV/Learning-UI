import type { Session } from '../../types'
import { getScoreTextColor, getScoreBarColor } from '../../lib/scoring'

interface Props {
  session: Session
}

export default function ReadinessPanel({ session }: Props) {
  const scoreColor = getScoreTextColor(session.readinessScore)
  const barColor = getScoreBarColor(session.readinessScore)

  const covered = session.coveredTopics?.length ?? 0
  const total = session.syllabusTopics?.length ?? 0
  const coveragePct = total > 0 ? Math.round((covered / total) * 100) : 0

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-4">Readiness</h2>

      <div className={`text-4xl font-semibold mb-4 ${scoreColor}`}>
        {session.readinessScore}%
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Readiness</span>
            <span>{session.readinessScore}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${Math.min(session.readinessScore, 100)}%` }}
            />
          </div>
        </div>

        {total > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Coverage</span>
              <span>{covered}/{total}</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-400 transition-all"
                style={{ width: `${coveragePct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
