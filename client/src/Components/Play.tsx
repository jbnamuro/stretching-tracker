import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import API from '../lib/api';

const Play = () => {
    const [stretches, setRoutine] = useState<{
        routineStretches: Array<{ stretch: { durationSeconds: number } }>
    } | null>(null);
    const { id } = useParams();
    const [timerValue, setTimerValue] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [stretchIndex, setIndex] = useState<number>(1);
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
                console.log(routine.routineStretches);
                setTimerValue(routine.routineStretches[0].stretch.durationSeconds);
                setRoutine({
                    routineStretches: routine.routineStretches || []
                });


            } catch (err) {
                console.error(err);
            }
        }
        getRoutine()
    }
        , [])

    useEffect(() => {
        if (!isRunning || !stretches) return

        if (timerValue <= 0) {
            const pause = setTimeout(() => {
                if (stretchIndex >= stretches.routineStretches.length) {
                    setIsRunning(false);
                    setIndex(0);
                    return;
                }

                setTimerValue(stretches.routineStretches[stretchIndex].stretch.durationSeconds);
                setIndex((previous) => previous + 1);
            }, 1000);

            return () => clearTimeout(pause);
        }

        const timer = setInterval(() => {
            setTimerValue((previous) => previous - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [isRunning, timerValue, stretches, stretchIndex])

    return (
        <div>
            <div className='cursor-pointer' onClick={() => {
                setIsRunning(!isRunning);
                console.log(isRunning);
            }}>run</div>
            <p>{timerValue}</p>
            <p>{stretches?.routineStretches.length || 0} stretches</p>
        </div>
    )
}

export default Play