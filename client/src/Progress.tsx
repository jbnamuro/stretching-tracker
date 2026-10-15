import { useEffect, useState } from "react"
import { Temporal } from "@js-temporal/polyfill"
import API from "./lib/api"

const Progress = () => {
    const [displayName, setDisplayName] = useState('')
    const [entries, setEntries] = useState<Array<{
        id: string
        completedDate: string
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
            }
            catch (err) {
                console.error(err)
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

    return (
        <div className="">
            <h1 className="text-2xl ml-5 font-medium">{displayName}</h1>
            <div className="flex bg-surface-container-low justify-between items-center mt-5 mx-5 drop-shadow-lg rounded-lg p-5">
                <p>{entries.length} Sessions</p>
                <p>{Math.round(entries.reduce((acc, entry) => acc + (entry.actualDuration ?? 0), 0) / 60)} minutes</p>
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
        </div>
    )
}

export default Progress
