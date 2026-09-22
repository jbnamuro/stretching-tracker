import React, { use, useState } from 'react'
import API from '../lib/api'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Routine = () => {
    const [routine, setRoutine] = useState<{ routineName: string; routineDescription: string; totalDuration: number | null } | null>(null);
    const { id } = useParams();
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
                console.log(routine);
                setRoutine({
                    routineName: routine.name,
                    routineDescription: routine.description,
                    totalDuration: routine.totalDuration || null
                });

            } catch (err) {
                console.error(err);
            }
        }
        getRoutine()
    }
        , [])

    return (
        <div>
            {routine ? (
                <div>
                    <h2>{routine.routineName}</h2>
                    <p>{routine.routineDescription}</p>
                    <p>Total Duration: {routine.totalDuration !== null ? `${routine.totalDuration} seconds` : 'Not specified'}</p>
                    <Link to={'#'}>Play</Link>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </div>
    )
}

export default Routine