import { useEffect, useState } from 'react'
import Goal from './Components/Goal'
import Streak from './Components/Streak'
import Loading from './Components/Loading'
import API from './lib/api'
import { Temporal } from '@js-temporal/polyfill'

const Dashboard = () => {
    const [entries, setEntries] = useState<Array<{
        completedDate: string
        actualDuration?: number | null
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

    const today = Temporal.Now.plainDateISO().toString()
    const todayMinutes = Math.floor(
        entries
            .filter((entry) => entry.completedDate.slice(0, 10) === today)
            .reduce((total, entry) => total + (entry.actualDuration ?? 0), 0) / 60
    )
    const completedDates = entries.map((entry) => entry.completedDate.slice(0, 10))

    return (
        <div className='px-4' style={{ marginBottom: menuHeight + 20 }}>
            <h3 className='uppercase tracking-wider font-display font-bold text-primary-dim'>your daily breath</h3>
            <h1 className='font-bold text-display-md tracking-tight'>Today's Goal</h1>
            <Goal timeLeft={todayMinutes} />
            <Streak completedDates={completedDates} />
        </div>
    )
}

export default Dashboard