import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import type { WeakArea } from '../../types'
import { formatDate } from '../../lib/utils'

interface Props {
  weakAreas: WeakArea[]
}

export default function WeakAreasSummary({ weakAreas }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
      >
        <AlertTriangle size={16} className="text-amber-500 shrink-0" />
        <span className="font-semibold text-slate-800 dark:text-slate-100 flex-1 text-left text-sm">Weak Areas</span>
        <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
          {weakAreas.length}
        </span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 px-5 pb-3">
          {weakAreas.map(area => (
            <li key={area.id} className="py-3 flex gap-3 items-start">
              <span className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 rounded-full px-2 py-0.5 font-medium shrink-0 mt-0.5">
                {area.topicSlug}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{area.subTopic}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{area.description}</div>
                <div className="text-xs text-slate-400 mt-1">{formatDate(area.lastUpdated)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
