import { useEffect, useRef } from 'react'
import { marked } from 'marked'

interface Props {
  notes: string
}

export default function NotesViewer({ notes }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = marked.parse(notes) as string
    }
  }, [notes])

  if (!notes) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-sm text-slate-400">
        No notes yet.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-4">Notes</h2>
      <div
        ref={ref}
        className="prose dark:prose-invert max-w-none prose-sm prose-slate prose-headings:font-semibold prose-a:text-violet-600"
      />
    </div>
  )
}
