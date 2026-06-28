import { useState } from 'react'
import { Filter, Plus, ChevronDown, ChevronUp, Pencil, Trash2, X, AlertTriangle } from 'lucide-react'
import type { QAItem } from '../../types'
import { api } from '../../lib/api'

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-900/60 text-emerald-400',
  medium: 'bg-amber-900/60 text-amber-400',
  hard: 'bg-red-900/60 text-red-400',
}

type FilterKey = 'all' | 'weak' | 'easy' | 'medium' | 'hard'

function attemptPct(item: QAItem): string | null {
  if (!item.attempts || item.attempts.length === 0) return null
  const correct = item.attempts.filter(a => a.correct).length
  return `${Math.round((correct / item.attempts.length) * 100)}% (${item.attempts.length} attempts)`
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-5">
          <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-200">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="text-xs px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="text-xs px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

interface CardFormProps {
  initial?: Partial<QAItem>
  onSave: (data: { question: string; answer: string; difficulty: QAItem['difficulty']; tags: string[] }) => Promise<void>
  onClose: () => void
  title: string
}

function CardForm({ initial, onSave, onClose, title }: CardFormProps) {
  const [question, setQuestion] = useState(initial?.question ?? '')
  const [answer, setAnswer] = useState(initial?.answer ?? '')
  const [difficulty, setDifficulty] = useState<QAItem['difficulty']>(initial?.difficulty ?? 'medium')
  const [tagsRaw, setTagsRaw] = useState((initial?.tags ?? []).join(', '))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!question.trim() || !answer.trim()) { setError('Question and answer are required.'); return }
    setSaving(true)
    setError('')
    try {
      await onSave({
        question: question.trim(),
        answer: answer.trim(),
        difficulty,
        tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
      })
      onClose()
    } catch {
      setError('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-sm">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Question</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              placeholder="Scenario or trade-off question…"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={4}
              className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500 resize-none"
              placeholder="Model answer…"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as QAItem['difficulty'])}
                className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block">Tags (comma-separated)</label>
              <input
                value={tagsRaw}
                onChange={e => setTagsRaw(e.target.value)}
                className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="LRU, eviction, TTL"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="text-xs px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="text-xs px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface QACardProps {
  item: QAItem
  topicSlug: string
  onUpdated: (item: QAItem) => void
  onDeleted: (id: string) => void
}

function QACard({ item, onUpdated, onDeleted }: QACardProps) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const pct = attemptPct(item)

  async function handleDelete() {
    setConfirmDelete(false)
    setDeleting(true)
    try {
      await api.deleteCard(item.id)
      onDeleted(item.id)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to delete.')
      setDeleting(false)
    }
  }

  return (
    <>
      {editing && (
        <CardForm
          title="Edit card"
          initial={item}
          onSave={async (data) => {
            const updated = await api.updateCard(item.id, data)
            onUpdated(updated)
          }}
          onClose={() => setEditing(false)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          message="Delete this Q&A card? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      <div className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden ${deleting ? 'opacity-50' : ''}`}>
        {errorMsg && (
          <div className="px-4 py-2 bg-red-900/30 border-b border-red-800 text-xs text-red-400 flex items-center justify-between">
            {errorMsg}
            <button onClick={() => setErrorMsg('')} className="ml-2 hover:text-red-200"><X size={12} /></button>
          </div>
        )}
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
            <button onClick={() => setEditing(true)} className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors"><Pencil size={13} /></button>
            <button onClick={() => setConfirmDelete(true)} disabled={deleting} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors disabled:opacity-40"><Trash2 size={13} /></button>
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
    </>
  )
}

interface Props {
  items: QAItem[]
  topicSlug: string
}

export default function QAList({ items: initialItems, topicSlug }: Props) {
  const [items, setItems] = useState<QAItem[]>(initialItems)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [adding, setAdding] = useState(false)

  const weakCount = items.filter(i => i.wrongCount > 0).length

  const filtered = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'weak') return item.wrongCount > 0
    return item.difficulty === filter
  })

  const tabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: `All (${items.length})` },
    { key: 'weak', label: `Weak (${weakCount})` },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  return (
    <div>
      {adding && (
        <CardForm
          title="Add Q&A card"
          onSave={async (data) => {
            const id = `q-${Date.now()}`
            const card = await api.addCard(topicSlug, { id, ...data })
            setItems(prev => [...prev, card])
          }}
          onClose={() => setAdding(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
          <span className="font-semibold text-white text-sm">Q&amp;A</span>
          <Filter size={14} className="text-slate-500" />
          <div className="flex gap-1 flex-wrap">
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
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-medium transition-colors self-start sm:self-auto"
        >
          <Plus size={13} />
          Add Q&amp;A
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-slate-500 py-4">No cards match this filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <QACard
              key={item.id}
              item={item}
              topicSlug={topicSlug}
              onUpdated={updated => setItems(prev => prev.map(c => c.id === updated.id ? updated : c))}
              onDeleted={id => setItems(prev => prev.filter(c => c.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
