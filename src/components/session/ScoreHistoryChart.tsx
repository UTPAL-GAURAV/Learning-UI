import type { ScoreEntry } from '../../types'
import { formatShortDate } from '../../lib/utils'

interface Props {
  scores: ScoreEntry[]
}

export default function ScoreHistoryChart({ scores }: Props) {
  const entries = scores.slice(-10)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <h2 className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-3">Score History</h2>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-400">No score history yet.</p>
      ) : (
        <ScoreChart entries={entries} />
      )}
    </div>
  )
}

function ScoreChart({ entries }: { entries: ScoreEntry[] }) {
  const W = 220
  const H = 80
  const PAD_L = 4
  const PAD_R = 4
  const PAD_T = 6
  const PAD_B = 20

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B

  const xs = entries.map((_, i) =>
    PAD_L + (entries.length === 1 ? plotW / 2 : (i / (entries.length - 1)) * plotW)
  )
  const ys = entries.map(e => PAD_T + plotH - (e.score / 100) * plotH)
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={3} fill="#7c3aed" />
      ))}
      {entries.map((e, i) => (
        <text
          key={i}
          x={xs[i]}
          y={H - 4}
          textAnchor="middle"
          fontSize={7}
          fill="currentColor"
          className="text-slate-400"
          transform={`rotate(-35, ${xs[i]}, ${H - 4})`}
        >
          {formatShortDate(e.date)}
        </text>
      ))}
    </svg>
  )
}
