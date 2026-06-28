import { useEffect, useRef, useState } from 'react'
import { marked } from 'marked'
import { Eye, Pencil } from 'lucide-react'

const HEADING_COLORS = [
  'text-sky-400',
  'text-amber-400',
  'text-emerald-400',
  'text-violet-400',
  'text-rose-400',
  'text-teal-400',
]

function colorizeHeadings(html: string): string {
  let idx = 0
  return html.replace(/<h([1-3])>(.*?)<\/h\1>/g, (_match, level, content) => {
    const color = HEADING_COLORS[idx++ % HEADING_COLORS.length]
    return `<h${level} class="notes-heading ${color}">${content}</h${level}>`
  })
}

interface Props {
  notes: string
  topicSlug?: string
  onSave?: (notes: string) => Promise<void>
}

export default function NotesViewer({ notes, onSave }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(notes)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(notes)
  }, [notes])

  useEffect(() => {
    if (!editing && ref.current) {
      const raw = marked.parse(draft) as string
      ref.current.innerHTML = colorizeHeadings(raw)
    }
  }, [draft, editing])

  async function handleSave() {
    if (!onSave) return
    setSaving(true)
    try {
      await onSave(draft)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
        <span className="font-semibold text-white text-sm">Notes</span>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-slate-500">Saving…</span>}
          {!saving && !editing && draft && <span className="text-xs text-slate-500">Saved</span>}
          {editing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Eye size={14} />
              Preview
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className="w-full bg-slate-900 text-slate-200 text-sm font-mono p-5 resize-none outline-none min-h-[300px] sm:min-h-[400px] leading-relaxed"
          placeholder="Write notes in Markdown…"
          spellCheck={false}
        />
      ) : (
        <div className="p-5">
          {!draft ? (
            <p className="text-sm text-slate-500">No notes yet.</p>
          ) : (
            <div
              ref={ref}
              className="notes-content prose-sm max-w-none"
            />
          )}
        </div>
      )}
    </div>
  )
}
