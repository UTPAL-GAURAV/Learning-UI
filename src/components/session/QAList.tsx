import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { QAItem } from '../../types'
import { formatDate } from '../../lib/utils'

const difficultyMap = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

interface CardProps {
  item: QAItem
}

function QACard({ item }: CardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${difficultyMap[item.difficulty]}`}>
          {item.difficulty}
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-200 flex-1 leading-snug">{item.question}</span>
        {open ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.answer}</p>
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 text-xs text-slate-400">
            <span>Wrong: {item.wrongCount}</span>
            {item.lastReviewed && <span>Reviewed: {formatDate(item.lastReviewed)}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  items: QAItem[]
}

export default function QAList({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-3">
        Q&amp;A Cards <span className="text-slate-400 font-normal">({items.length})</span>
      </h2>
      <div className="space-y-2">
        {items.map(item => <QACard key={item.id} item={item} />)}
      </div>
    </div>
  )
}
