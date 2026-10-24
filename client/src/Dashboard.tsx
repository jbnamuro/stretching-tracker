import { useEffect, useState } from 'react'
import Goal from './Components/Goal'
import Streak from './Components/Streak'
import Loading from './Components/Loading'
import API from './lib/api'
import { defaultRoutineIcon, routineIcons } from './lib/routineIcons'
import { Temporal } from '@js-temporal/polyfill'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    const [entries, setEntries] = useState<Array<{
        id: string
        completedDate: string
        actualDuration?: number | null
        routine: {
            id: string
            name: string
            iconName: string | null
        }
    }>>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`${API}/calendar`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`)
                }
                const data = await response.json()
                setEntries(data.data.entries)
            } catch (err) {
                console.error(err)
                setLoadError(true)
            } finally {
                setIsLoading(false)
            }
        }

        getDashboardData()
    }, [])

    const additional = document.getElementsByClassName('menu');
    const menuHeight = additional[0]?.clientHeight || 0;

    if (isLoading) {
        return <Loading />
    }

    if (loadError) {
        return <p className='mx-5 mt-5 text-center text-on-surface-variant'>Could not load dashboard. Please try again.</p>
    }

    // get today's date
    const today = Temporal.Now.plainDateISO().toString()
    // get today's sessions
    const todayEntries = entries.filter((entry) => entry.completedDate.slice(0, 10) === today)
    // calculate today's minutes
    const todayMinutes = Math.floor(
        todayEntries.reduce((total, entry) => total + (entry.actualDuration ?? 0), 0) / 60
    )
    const completedDates = entries.map((entry) => entry.completedDate.slice(0, 10))
    const recentEntries = entries.slice(0, 2)

    return (
        <div className='px-4' style={{ marginBottom: menuHeight + 20 }}>
            <h3 className='uppercase tracking-wider font-display font-bold text-primary-dim'>your daily breath</h3>
            <h1 className='font-bold text-display-md tracking-tight'>Today's Goal</h1>
            <Goal timeLeft={todayMinutes} sessionsCompleted={todayEntries.length} />
            <Streak completedDates={completedDates} />
            <section>
                <h2 className='font-semibold mt-5 text-headline-sm'>Quick Start</h2>
                {recentEntries.length > 0 ? (
                    <div className='mt-3 grid grid-cols-2 gap-3'>
                        {recentEntries.map((entry) => (
                            <Link
                                key={entry.id}
                                to={`/routines/${entry.routine.id}/play`}
                                className='flex min-w-0 flex-col items-start gap-3 rounded-xl bg-surface-container-lowest p-4 drop-shadow-lg transition-colors hover:bg-surface-container-high'
                            >
                                <img
                                    className='h-8 w-8'
                                    src={routineIcons[entry.routine.iconName ?? ''] ?? defaultRoutineIcon}
                                    alt=""
                                />
                                <span className='font-medium'>{entry.routine.name}</span>
                                <span className='text-sm text-primary'>Start routine</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className='mt-2 text-sm text-on-surface-variant'>Complete a routine to see it here.</p>
                )}
            </section>
        </div>
    )
}

export default Dashboard