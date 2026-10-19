import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import Header from './Components/Header'
import Library from './Library'
import Loading from './Components/Loading'
import Login from './Login'
import Menu from './Components/Menu'
import Play from './Components/Play'
import Progress from './Progress'
import API from './lib/api'

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

const App = () => {
    const [authStatus, setAuthStatus] = useState<AuthStatus>(() =>
        localStorage.getItem('token') ? 'checking' : 'unauthenticated'
    )

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            return
        }

        const verifySession = async () => {
            try {
                const response = await fetch(`${API}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.ok) {
                    setAuthStatus('authenticated')
                } else {
                    localStorage.removeItem('token')
                    setAuthStatus('unauthenticated')
                }
            } catch (error) {
                console.error('Could not verify the saved login session:', error)
                setAuthStatus('unauthenticated')
            }
        }

        verifySession()
    }, [])

    if (authStatus === 'checking') {
        return <Loading />
    }

    if (authStatus === 'unauthenticated') {
        return <Login onLogin={() => setAuthStatus('authenticated')} />
    }

    return (
        <BrowserRouter>
            <Header />
            <Menu />

            <Routes>
                <Route path='*' element={<Dashboard />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/library' element={<Library />} />
                <Route path='/progress' element={<Progress />} />
                <Route path='/generate' element={<Navigate to='/progress' replace />} />
                <Route path='routines/:id/play' element={<Play />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
