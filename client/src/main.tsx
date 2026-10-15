import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import './index.css'
import Menu from './Components/Menu'
import Header from './Components/Header'
import Library from './Library'
import Play from './Components/Play'
import Progress from './Progress'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Menu />

      <Routes>
        <Route path="*" element={<Dashboard />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/library' element={<Library />} />
        <Route path='/progress' element={<Progress />} />
        <Route path='/generate' element={<Navigate to='/progress' replace />} />
        <Route path='routines/:id/play' element={<Play />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
