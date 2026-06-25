import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyTheme, getTheme } from './lib/theme'

applyTheme(getTheme())

// Handle OAuth callback token in hash
const hash = window.location.hash
if (hash.startsWith('#token=')) {
  const token = hash.slice(7)
  localStorage.setItem('LEARNING_TOKEN', token)
  window.location.hash = ''
  window.location.reload()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
