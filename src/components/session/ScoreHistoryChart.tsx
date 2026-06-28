import { TrendingUp } from 'lucide-react'
import type { ScoreEntry } from '../../types'
import { formatShortDate } from '../../lib/utils'

interface Props {
  scores: ScoreEntry[]
}

export default function ScoreHistoryChart({ scores }: Props) {
  const entries = scores.slice(-10)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-violet-500" />
          <h2 className="font-semibold text-white text-sm">Score Over Time</h2>
        </div>
        <button className="text-xs text-slate-400 hover:text-violet-400 transition-colors">+ Log score</button>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-500">No score history yet.</p>
      ) : (
        <ScoreChart entries={entries} />
      )}
    </div>
  )
}

function ScoreChart({ entries }: { entries: ScoreEntry[] }) {
  const W = 260
  const H = 90
  const PAD_L = 4
  const PAD_R = 4
  const PAD_T = 18
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
      <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r={3.5} fill="#7c3aed" />
          <text x={x} y={ys[i] - 6} textAnchor="middle" fontSize={8} fill="#a78bfa" fontWeight="600">
            {entries[i].score}
          </text>
        </g>
      ))}
      {entries.map((e, i) => (
        <text
          key={i}
          x={xs[i]}
          y={H - 2}
          textAnchor="middle"
          fontSize={7}
          fill="#64748b"
          transform={`rotate(-30, ${xs[i]}, ${H - 2})`}
        >
          {formatShortDate(e.date)}
        </text>
      ))}
    </svg>
  )
}
