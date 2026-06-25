import type { SessionIndexEntry } from '../../types'
import TopicCard from './TopicCard'

interface Props {
  sessions: SessionIndexEntry[]
}

export default function TopicGrid({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No sessions yet. Start a learning session in VS Code to get going.
      </div>
    )
  }

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map(session => (
        <TopicCard key={session.topicSlug} session={session} />
      ))}
    </div>
  )
}
