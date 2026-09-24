import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import './index.css'
import Menu from './Components/Menu'
import Header from './Components/Header'
import Library from './Library'
import Routine from './Components/Routine'
import Play from './Components/Play'
import Generate from './Generate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Menu />

      <Routes>
        <Route path="*" element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/library' element={<Library />} />
        <Route path='/generate' element={<Generate />} />
        <Route path="routines/:id" element={<Routine />} />
        <Route path='routines/:id/play' element={<Play />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
