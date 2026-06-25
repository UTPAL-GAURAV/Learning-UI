export function getScoreLabel(score: number): { label: string; className: string } {
  if (score >= 75) return { label: 'Ready', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' }
  if (score >= 40) return { label: 'In Progress', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' }
  if (score > 0) return { label: 'Needs Work', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' }
  return { label: 'New', className: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' }
}

export function getScoreTextColor(score: number): string {
  if (score >= 75) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 40) return 'text-amber-500 dark:text-amber-400'
  if (score > 0) return 'text-red-500 dark:text-red-400'
  return 'text-slate-400 dark:text-slate-500'
}

export function getScoreBarColor(score: number): string {
  if (score >= 75) return 'bg-emerald-400'
  if (score >= 40) return 'bg-amber-400'
  if (score > 0) return 'bg-red-400'
  return 'bg-slate-300 dark:bg-slate-700'
}
