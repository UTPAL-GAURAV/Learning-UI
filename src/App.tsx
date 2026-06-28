import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './store'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SessionPage from './pages/SessionPage'

export default function App() {
  const token = localStorage.getItem('LEARNING_TOKEN')
  const { load, loaded } = useStore()
  const [serverDown, setServerDown] = useState(false)

  useEffect(() => {
    if (token) load().catch(() => setServerDown(true))
  }, [token])

  if (!token) return <LoginPage />

  if (serverDown) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-3">
          <div className="text-2xl">⏳</div>
          <p className="text-white font-semibold text-sm">Backend is starting up</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            The server is on Render's free tier and takes ~30s to wake up after inactivity. Wait a moment and refresh the page.
          </p>
          <button
            onClick={() => { setServerDown(false); load().catch(() => setServerDown(true)) }}
            className="mt-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading…</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/:topicSlug" element={<SessionPage />} />
      </Routes>
    </BrowserRouter>
  )
}
