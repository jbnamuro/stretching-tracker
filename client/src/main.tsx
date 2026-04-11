import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Timer from './Timer'
import Dashboard from './Dashboard'
import './index.css'
import Menu from './Menu'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Menu />

      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/timer' element={<Timer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
