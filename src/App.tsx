import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './store'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SessionPage from './pages/SessionPage'

export default function App() {
  const token = localStorage.getItem('LEARNING_TOKEN')
  const { load, loaded } = useStore()

  useEffect(() => {
    if (token) load()
  }, [token])

  if (!token) return <LoginPage />

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
