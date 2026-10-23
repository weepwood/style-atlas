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
import './styles/new-style-previews.css'
import './styles/theme-refinements.css'
import './styles/interaction-fixes.css'
import './styles/collection-atlas.css'
import './styles/component-playground.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
