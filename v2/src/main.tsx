import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { V2App } from './app/V2App.tsx'
import './styles/reset.css'
import './styles/foundation.css'

const rootElement = document.getElementById('v2-root')

if (!rootElement) throw new Error('Missing #v2-root application mount')

createRoot(rootElement).render(
  <StrictMode>
    <V2App />
  </StrictMode>,
)
