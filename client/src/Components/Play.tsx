import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Temporal } from '@js-temporal/polyfill'
import API from '../lib/api';

const Play = () => {
    const [stretches, setRoutine] = useState<{
        routineStretches: Array<{ stretch: { name: string; durationSeconds: number } }>
    } | null>(null);
    const { id } = useParams();
    const [timerValue, setTimerValue] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [stretchIndex, setIndex] = useState<number>(0);
    const [completionStatus, setCompletionStatus] = useState('')
    const completionStarted = useRef(false)

    useEffect(() => {
        const getRoutine = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API}/routines/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                const data = await response.json();
                const routine = data.data.routine;
                const routineStretches = routine.routineStretches || [];
                completionStarted.current = false
                setCompletionStatus('')
                setRoutine({
                    routineStretches
                });
                if (routineStretches.length > 0) {
                    setTimerValue(routineStretches[0].stretch.durationSeconds);
                }
            } catch (err) {
                console.error(err);
            }
        }
        getRoutine()
    }, [id])

    useEffect(() => {
        if (!isRunning || !stretches || stretches.routineStretches.length === 0) return

        if (timerValue <= 0) {
            const pause = setTimeout(async () => {
                if (stretchIndex >= stretches.routineStretches.length - 1) {
                    setIsRunning(false);

                    if (completionStarted.current) return
                    completionStarted.current = true
                    setCompletionStatus('Saving completion...')

                    try {
                        if (!id) throw new Error('Routine ID is missing')

                        const token = localStorage.getItem('token')
                        const actualDuration = stretches.routineStretches.reduce(
                            (total, routineStretch) => total + routineStretch.stretch.durationSeconds,
                            0
                        )
                        const response = await fetch(`${API}/calendar`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                routineId: id,
                                completedDate: Temporal.Now.plainDateISO().toString(),
                                actualDuration
                            })
                        })
                        const data = await response.json()

                        if (!response.ok) {
                            throw new Error(data.message || `HTTP Error ${response.status}`)
                        }

                        setCompletionStatus('Routine completion saved')
                    } catch (err) {
                        console.error(err)
                        setCompletionStatus(err instanceof Error ? err.message : 'Could not save routine completion')
                    }
                    return;
                }

                const nextIndex = stretchIndex + 1;
                setIndex(nextIndex);
                setTimerValue(stretches.routineStretches[nextIndex].stretch.durationSeconds);
            }, 1000);

            return () => clearTimeout(pause);
        }

        const timer = setInterval(() => {
            setTimerValue((previous) => previous - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [id, isRunning, timerValue, stretches, stretchIndex])

    const currentStretch = stretches?.routineStretches[stretchIndex]
    const minutes = Math.floor(timerValue / 60).toString().padStart(2, '0')
    const seconds = (timerValue % 60).toString().padStart(2, '0')
    const isFinished = Boolean(
        stretches &&
        currentStretch &&
        timerValue === 0 &&
        stretchIndex === stretches.routineStretches.length - 1
    )

    return (
        <main className="mx-5 flex min-h-[65vh] flex-col items-center justify-between py-8 text-center">
            <h1 className="w-full text-left font-display text-headline-sm font-semibold text-on-surface">
                {currentStretch?.stretch.name || 'Loading movement...'}
            </h1>

            <p className="font-display text-[5rem] font-bold leading-none tabular-nums tracking-tight text-on-surface sm:text-[7rem]" role="timer" aria-live="off">
                {minutes}:{seconds}
            </p>

            <button
                type="button"
                className="rounded-full bg-primary px-8 py-3 font-semibold text-on-primary transition-colors hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setIsRunning((running) => !running)}
                disabled={!currentStretch || isFinished}
            >
                {isRunning ? 'Pause' : isFinished ? 'Finished' : 'Start'}
            </button>
            {completionStatus && (
                <p className="text-sm text-on-surface-variant">
                    {completionStatus}
                </p>
            )}
        </main>
    )
}

export default Play