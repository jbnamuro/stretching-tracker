import { useState } from 'react'
import type { FormEvent } from 'react'
import API from './lib/api'

const Generate = () => {
    const [prompt, setPrompt] = useState('')
    const [submittedPrompt, setSubmittedPrompt] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedPrompt = prompt.trim()
        if (!trimmedPrompt) return

        setError('')
        setIsLoading(true)

        try {
            const response = await fetch(`${API}/routines/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ prompt: trimmedPrompt }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Routine generation failed')

            setSubmittedPrompt(data.data.routine.name)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Routine generation failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="routine-request">Describe the routine you want</label>
                <textarea
                    id="routine-request"
                    name="routineRequest"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Example: Create a 15-minute beginner routine for tight hips and back."
                    rows={6}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate routine'}
                </button>
            </form>
            {submittedPrompt && <p>Request ready: {submittedPrompt}</p>}
            {error && <p>{error}</p>}
        </div>
    )
}

export default Generate