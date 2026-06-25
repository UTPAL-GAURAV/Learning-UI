import type { PendingTopic } from '../../types'

interface Props {
  topics: PendingTopic[]
}

export default function PendingTopicsPanel({ topics }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5">
      <h2 className="font-semibold text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wide mb-3">
        Deferred Topics
      </h2>
      <ul className="space-y-3">
        {topics.map((t, i) => (
          <li key={i}>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.subTopic}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.reason}</div>
            {t.suggestedPlacement && (
              <div className="text-xs text-slate-400 italic mt-0.5">{t.suggestedPlacement}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
