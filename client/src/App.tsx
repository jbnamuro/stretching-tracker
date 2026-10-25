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
import NewRoutine from './Components/NewRoutine'

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

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })
            if (!response.ok) {
                console.error('Could not clear the server login session.')
            }
        } catch (error) {
            console.error('Could not reach the server to clear the login session:', error)
        } finally {
            localStorage.removeItem('token')
            setAuthStatus('unauthenticated')
        }
    }

    if (authStatus === 'checking') {
        return <Loading />
    }

    if (authStatus === 'unauthenticated') {
        return <Login onLogin={() => setAuthStatus('authenticated')} />
    }

    return (
        <BrowserRouter>
            <Header onLogout={() => { void handleLogout() }} />
            <Menu />

            <Routes>
                <Route path='*' element={<Dashboard />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/library' element={<Library />} />
                <Route path='/progress' element={<Progress />} />
                <Route path='/generate' element={<Navigate to='/progress' replace />} />
                <Route path='routines/:id/play' element={<Play />} />
                <Route path='/routines/new' element={<NewRoutine />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
