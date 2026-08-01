import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/base.css'
import './styles/hero.css'
import './styles/gallery.css'
import './styles/previews-a.css'
import './styles/previews-b.css'
import './styles/previews-c.css'
import './styles/dialog-responsive.css'
import './styles/themes.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
