import { useEffect, useState } from 'react'
import { BookOpen, AlertTriangle } from 'lucide-react'
import { api } from '../lib/api'

export default function LoginPage() {
  const [tokenExpired, setTokenExpired] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token_expired') === 'true') {
      setTokenExpired(true)
      localStorage.removeItem('token_expired')
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm shadow-sm">
        <div className="flex items-center gap-2 text-violet-600">
          <BookOpen size={28} />
          <span className="text-xl font-semibold text-slate-800 dark:text-slate-100">Learning</span>
        </div>

        {tokenExpired ? (
          <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={15} />
              <span className="text-sm font-semibold">Session token expired</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your auth token has expired. Sign in again with Google, then update your token:
            </p>
            <ol className="text-xs text-slate-400 space-y-1.5 list-none">
              <li><span className="text-slate-500 font-medium">1.</span> Click <span className="text-white font-medium">Login with Google</span> below</li>
              <li><span className="text-slate-500 font-medium">2.</span> Click <span className="text-white font-medium">Copy token</span> in the header</li>
              <li>
                <span className="text-slate-500 font-medium">3.</span> Update <code className="text-sky-400 bg-slate-800 px-1 rounded">.env</code> in your repo:
                <code className="block bg-slate-800 text-sky-400 px-2 py-1.5 rounded mt-1 font-mono">LEARNING_TOKEN=&lt;new token&gt;</code>
              </li>
            </ol>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Sign in to access your learning sessions.
          </p>
        )}

        <a
          href={api.googleAuthUrl()}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Login with Google
        </a>
      </div>
    </div>
  )
}
