interface Props {
  concepts: string[]
}

export default function KeyConceptsList({ concepts }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-3">Key Concepts</h2>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept, i) => (
          <span
            key={i}
            className="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 rounded-full px-3 py-1 text-sm"
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  )
}
