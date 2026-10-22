import { useEffect, useState } from "react"
import { Temporal } from "@js-temporal/polyfill"
import API from "./lib/api"
import Loading from "./Components/Loading"

const Progress = () => {
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(false)
    const [entries, setEntries] = useState<Array<{
        id: string
        completedDate: string
        completedAt: string
        actualDuration: number | null
        notes: string | null
        routine: { name: string }
    }>>([])

    useEffect(() => {
        const getPageData = async () => {
            try {
                const token = localStorage.getItem('token')
                const headers = {
                    Authorization: `Bearer ${token}`
                }

                const [userResponse, calendarResponse] = await Promise.all([
                    fetch(`${API}/auth/me`, { headers }),
                    fetch(`${API}/calendar`, { headers })
                ])

                if (!userResponse.ok) {
                    throw new Error(`HTTP Error ${userResponse.status}`)
                }
                if (!calendarResponse.ok) {
                    throw new Error(`HTTP Error ${calendarResponse.status}`)
                }

                const userData = await userResponse.json()
                const calendarData = await calendarResponse.json()

                setDisplayName(userData.data.user.displayName)
                setEntries(calendarData.data.entries)
                console.log(calendarData.data.entries)
            }
            catch (err) {
                console.error(err)
                setLoadError(true)
            }
            finally {
                setLoading(false)
            }
        }
        getPageData()
    }, [])

    const today = Temporal.Now.plainDateISO()
    const monday = today.subtract({ days: today.dayOfWeek - 1 })

    const week: Array<{ dateKey: string; label: string; minutes: number }> = []
    let date = monday

    for (let index = 0; index < 7; index++) {
        const dateKey = date.toString()
        const totalSeconds = entries
            .filter((entry) => entry.completedDate.slice(0, 10) === dateKey)
            .reduce((total, entry) => total + (entry.actualDuration ?? 0), 0)

        week.push({
            dateKey,
            label: date.toLocaleString('en-US', { weekday: 'short' }).charAt(0),
            minutes: Math.round(totalSeconds / 60)
        })
        date = date.add({ days: 1 })
    }

    let maxMinutes = 1
    for (const day of week) {
        if (day.minutes > maxMinutes) {
            maxMinutes = day.minutes
        }
    }
    const totalDuration = entries.reduce((total, entry) => total + (entry.actualDuration ?? 0), 0)
    const averageDuration = entries.length > 0 ? Math.round(totalDuration / entries.length) : 0
    const additional = document.getElementsByClassName('menu');
    const menuHeight = additional[0]?.clientHeight || 0;

    return (
        <div className="" style={{ marginBottom: menuHeight + 20 }}>
            {loading ? (
                <Loading />
            ) : loadError ? (
                <p className="mx-5 mt-5 text-center text-on-surface-variant">Could not load progress. Please try again.</p>
            ) : (
                <>
                    <h1 className="text-2xl ml-5 font-medium">{displayName}</h1>
                    <div className="flex bg-surface-container-low justify-between items-center mt-5 mx-5 drop-shadow-lg rounded-lg p-5">
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-lg">{entries.length}</p>
                            <p className="text-sm">Sessions</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-lg">
                                {`${Math.floor(totalDuration / 60).toString().padStart(2, '0')}:${(totalDuration % 60).toString().padStart(2, '0')}`}
                            </p>
                            <p className="text-sm">Total Time</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="font-bold text-lg">
                                {`${Math.floor(averageDuration / 60).toString().padStart(2, '0')}:${(averageDuration % 60).toString().padStart(2, '0')}`}
                            </p>
                            <p className="text-sm">Avg. Session</p>
                        </div>
                    </div>
                    <div className="bg-surface-container-low rounded-xl mx-5 mt-5 p-5 drop-shadow-lg">
                        <h2 className="mb-5 text-lg font-medium">Volume this week</h2>
                        <div className="grid grid-cols-7 gap-3" aria-label="Minutes of stretching from Monday to Sunday">
                            {week.map((day) => {
                                const barHeight = day.minutes > 0
                                    ? Math.max((day.minutes / maxMinutes) * 128, 4)
                                    : 0

                                return (
                                    <div key={day.dateKey} className="flex min-w-0 flex-col items-center">
                                        <span className="mb-5 text-xs font-medium">{day.minutes} m</span>
                                        <div className="flex w-full items-end rounded-xl bg-surface-container p-1" style={{ height: '128px' }}>
                                            <div
                                                className="w-full rounded-xl bg-primary"
                                                style={{ height: `${barHeight}px` }}
                                            />
                                        </div>
                                        <span className="mt-5 text-xs font-medium">{day.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl mt-5 ml-5 font-medium">Recent Movements</h2>
                        {entries.length === 0 ? (
                            <p className=" mt-5 text-center text-on-surface-variant">No recent movement yet.</p>
                        ) : (entries.slice(0, 3).map((entry) => (
                            <div key={entry.id} className="bg-surface-container-low flex justify-between rounded-xl mx-5 mt-5 p-5 drop-shadow-lg">
                                <div>
                                    <p className="text-lg font-medium">{entry.routine.name}</p>
                                    <p className="text-sm text-on-surface-variant">
                                        <span>
                                            {new Date(entry.completedAt).toLocaleString(undefined, {
                                                dateStyle: 'medium',
                                            })}
                                        </span><span> • </span>
                                        <span>{new Date(entry.completedAt).toLocaleTimeString(undefined, {
                                            timeStyle: 'short'
                                        })}</span>
                                    </p>
                                </div>
                                <p className="text-sm text-primary bg-primary-fixed-dim px-2 py-1 rounded-2xl h-fit">{Math.floor((entry.actualDuration ?? 0) / 60).toString().padStart(2, '0')}:{((entry.actualDuration ?? 0) % 60).toString().padStart(2, '0')}</p>
                            </div>
                        )))}
                    </div>
                </>
            )
            }
        </div >
    )
}

export default Progress
