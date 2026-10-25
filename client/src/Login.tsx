import { useState, type FormEvent } from 'react'
import API from './lib/api'

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const form = new FormData(event.currentTarget)
        const isRegisteringNow = isRegistering

        try {
            const response = await fetch(`${API}/auth/${isRegisteringNow ? 'register' : 'login'}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isRegisteringNow
                    ? {
                        displayName: form.get('displayName'),
                        email: form.get('email'),
                        password: form.get('password')
                    }
                    : {
                        email: form.get('email'),
                        password: form.get('password')
                    })
            })

            if (!response.ok) {
                setError(isRegisteringNow
                    ? response.status === 409
                        ? 'An account with this email already exists.'
                        : 'Could not create your account. Check your details and try again.'
                    : 'Email or password is incorrect.')
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
                    <h1 className='font-display text-headline-lg font-bold'>
                        {isRegistering ? 'Create your account' : 'Welcome back'}
                    </h1>
                </div>

                {isRegistering && (
                    <label className='flex flex-col gap-2 text-sm font-medium'>
                        Name
                        <input name='displayName' type='text' autoComplete='name' required maxLength={80} className='rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary' />
                    </label>
                )}

                <label className='flex flex-col gap-2 text-sm font-medium'>
                    Email
                    <input name='email' type='email' autoComplete='username' required maxLength={254} className='rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary' />
                </label>

                <label className='flex flex-col gap-2 text-sm font-medium'>
                    Password
                    <input name='password' type='password' autoComplete={isRegistering ? 'new-password' : 'current-password'} required minLength={isRegistering ? 8 : undefined} className='rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none focus:border-primary' />
                </label>

                {error && <p role='alert' className='text-sm text-red-700'>{error}</p>}

                <button type='submit' className='rounded-full bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-dim'>
                    {isRegistering ? 'Create account' : 'Sign in'}
                </button>
                <button
                    type='button'
                    onClick={() => {
                        setIsRegistering(!isRegistering)
                        setError('')
                    }}
                    className='text-sm font-semibold text-primary hover:underline'
                >
                    {isRegistering ? 'Already have an account? Sign in' : 'New here? Create an account'}
                </button>
            </form>
        </main>
    )
}

export default Login
