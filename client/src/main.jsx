import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WelconePage from './pages/WelcomePage/WelcomePage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WelconePage />
  </StrictMode>,
)
