import { useState } from 'react'
import { Filter, Plus, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import type { QAItem } from '../../types'

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-900/60 text-emerald-400',
  medium: 'bg-amber-900/60 text-amber-400',
  hard: 'bg-red-900/60 text-red-400',
}

type Filter = 'all' | 'weak' | 'easy' | 'medium' | 'hard'

function attemptPct(item: QAItem): string | null {
  if (!item.attempts || item.attempts.length === 0) return null
  const correct = item.attempts.filter(a => a.correct).length
  return `${Math.round((correct / item.attempts.length) * 100)}% (${item.attempts.length} attempts)`
}

function QACard({ item }: { item: QAItem }) {
  const [open, setOpen] = useState(false)
  const pct = attemptPct(item)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-3">
        <button onClick={() => setOpen(o => !o)} className="flex-1 flex items-start gap-3 text-left min-w-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 ${difficultyColor[item.difficulty]}`}>
            {item.difficulty}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {item.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
              {pct && <span className="text-xs text-slate-500 ml-1">{pct}</span>}
            </div>
            <p className="text-sm text-white leading-snug font-medium">{item.question}</p>
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <button className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors"><Pencil size={13} /></button>
          <button className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
          <button onClick={() => setOpen(o => !o)} className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors">
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-slate-800/30 border-t border-slate-800">
          <p className="text-sm text-slate-300 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

interface Props {
  items: QAItem[]
}

export default function QAList({ items }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const weakCount = items.filter(i => i.wrongCount > 0).length

  const filtered = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'weak') return item.wrongCount > 0
    return item.difficulty === filter
  })

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${items.length})` },
    { key: 'weak', label: `Weak (${weakCount})` },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm">Q&amp;A</span>
          <Filter size={14} className="text-slate-500" />
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-medium transition-colors">
          <Plus size={13} />
          Add Q&amp;A
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-slate-500 py-4">No cards match this filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => <QACard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
