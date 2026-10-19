import { useState, type FormEvent } from 'react'
import API from './lib/api'

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [error, setError] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const form = new FormData(event.currentTarget)

        try {
            const response = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.get('email'),
                    password: form.get('password')
                })
            })

            if (!response.ok) {
                setError('Email or password is incorrect.')
                return
            }

            const data = await response.json()
            localStorage.setItem('token', data.data.token)
            onLogin()
        } catch {
            setError('Could not connect. Please try again.')
        }
    }

    return (
        <main className='flex min-h-screen items-center justify-center bg-surface px-5'>
            <form onSubmit={handleSubmit} className='flex w-full max-w-sm flex-col gap-5 rounded-3xl bg-surface-container-lowest p-8 shadow-ambient'>
                <div>
                    <p className='mb-2 text-sm font-semibold tracking-widest text-primary'>STrack</p>
                    <h1 className='font-display text-headline-lg font-bold'>Welcome back</h1>
                </div>

                <label className='flex flex-col gap-2 text-sm font-medium'>
                    Email
                    <input name='email' type='email' autoComplete='username' required className='rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary' />
                </label>

                <label className='flex flex-col gap-2 text-sm font-medium'>
                    Password
                    <input name='password' type='password' autoComplete='current-password' required className='rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary' />
                </label>

                {error && <p role='alert' className='text-sm text-red-700'>{error}</p>}

                <button type='submit' className='rounded-full bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-dim'>
                    Sign in
                </button>
            </form>
        </main>
    )
}

export default Login
