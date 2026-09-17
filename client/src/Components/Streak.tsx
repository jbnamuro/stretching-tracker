import React, { useEffect } from 'react'
import API from '../lib/api'
import { Temporal } from '@js-temporal/polyfill'

const Streak = () => {
    const daysObject: Array<{ weekdayShort: string; day: string }> = [];
    let currentDate = Temporal.Now.plainDateISO();
    currentDate = currentDate.subtract({ days: 1 }); // 

    for (let i = 0; i < 5; i++) {
        const weekdayLong = currentDate.toLocaleString('en-US', { weekday: 'long' });
        const weekdayShort = weekdayLong.slice(0, 3);
        const day = String(currentDate.day); // day of month only

        daysObject.push({ weekdayShort, day });

        currentDate = currentDate.add({ days: 1 });
    }

    useEffect(() => {
        const getStreak = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = '2807ef65-e5d0-49d2-9058-bc9ec2d62d13';
                const response = await fetch(`${API}/calendar?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                const data = await response.json();

                console.log(data);
            } catch (err) {
                console.error(err);
            }
        }
        getStreak()
    }, [])
    return (
        <div className='mt-5 bg-surface-container-lowest rounded-xl px-8 py-5 drop-shadow-lg'>
            <p className='font-semibold text-headline-sm'>Upcoming Streaks</p>
            <div className='mt-5 flex justify-between'>
                {daysObject.map((d, index) => (
                    <div key={index} className='text-center '>
                        <div className='h-15 w-12 flex items-center justify-center bg-primary mb-2 rounded-2xl'>
                            <p className='text-white font-medium'>{d.day}</p>
                        </div>
                        <p className='font-medium'>{d.weekdayShort}</p>
                    </div>
                ))}
            </div>
            <div className='w-full h-px my-5 bg-black/10'></div>

            <p>Current Streak</p>
        </div>
    )
}

export default Streak