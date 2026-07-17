import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/schibsted-grotesk/index.css'
import '@fontsource-variable/fraunces/full-italic.css'
import '@fontsource/spline-sans-mono/index.css'
import '@fontsource/spline-sans-mono/500.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/sections.css'
import App from './App.tsx'
import { initTheme } from './theme/theme'

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
