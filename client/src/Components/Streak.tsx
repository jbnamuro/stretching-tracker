import { Temporal } from '@js-temporal/polyfill'

const Streak = ({ completedDates }: { completedDates: string[] }) => {
    const today = Temporal.Now.plainDateISO()
    const completedDateSet = new Set(completedDates)
    const daysObject = []
    let date = today.subtract({ days: 1 })

    for (let index = 0; index < 5; index++) {
        const dateKey = date.toString()

        daysObject.push({
            dateKey,
            weekdayShort: date.toLocaleString('en-US', { weekday: 'short' }),
            day: String(date.day),
            isToday: date.equals(today),
            isCompleted: completedDateSet.has(dateKey)
        })
        date = date.add({ days: 1 })
    }

    let streakStart = today
    if (!completedDateSet.has(streakStart.toString())) {
        streakStart = streakStart.subtract({ days: 1 })
    }

    let currentStreak = 0
    while (completedDateSet.has(streakStart.toString())) {
        currentStreak++
        streakStart = streakStart.subtract({ days: 1 })
    }

    return (
        <div className='mt-5 bg-surface-container-lowest rounded-xl px-8 py-5 drop-shadow-lg'>
            <p className='font-semibold text-headline-sm'>Upcoming Streaks</p>
            <div className='mt-5 flex justify-between'>
                {daysObject.map((day) => (
                    <div key={day.dateKey} className='text-center'>
                        <div className={`h-15 w-12 flex items-center justify-center mb-2 rounded-2xl ${day.isCompleted
                            ? 'bg-primary text-on-primary'
                            : day.isToday
                                ? 'bg-primary-dim text-on-primary'
                                : 'bg-surface-container-low text-on-surface-variant'
                            }`}>
                            <p className='font-medium'>{day.isCompleted ? '✓' : day.day}</p>
                        </div>
                        <p className={`font-medium ${day.isCompleted || day.isToday ? 'text-on-surface' : 'text-on-surface-variant'}`}>{day.weekdayShort}</p>
                    </div>
                ))}
            </div>
            <div className='w-full h-px my-5 bg-black/10'></div>

            <div className='flex justify-between items-center'>
                <p>Current Streak</p>
                <p className='font-semibold'>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
            </div>
            <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container'>
                <div
                    className='h-full rounded-full bg-primary'
                    style={{ width: `${Math.min((currentStreak / 7) * 100, 100)}%` }}
                />
            </div>
        </div>
    )
}

export default Streak
