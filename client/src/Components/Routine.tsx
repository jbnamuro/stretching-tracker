import React, { use, useState } from 'react'
import API from '../lib/api'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Routine = () => {
    const [routine, setRoutine] = useState<{ routineName: string; routineDescription: string; totalDuration: number | null; routineStretches: Array<{}> } | null>(null);
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
                    totalDuration: routine.totalDuration || null,
                    routineStretches: routine.routineStretches || []
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
                    <p>Duration: {routine.totalDuration !== null ? `${routine.totalDuration} seconds` : 'Not specified'}</p>
                    <p>Stretches: {routine.routineStretches?.length || 0}</p>
                    <Link to={'#'}>Begin Routine</Link>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </div>
    )
}

export default Routine