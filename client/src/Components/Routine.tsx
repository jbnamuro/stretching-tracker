import React, { use, useState } from 'react'
import API from '../lib/api'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Routine = () => {
    const [stretches, setRoutine] = useState<{ routineName: string; routineDescription: string; totalDuration: number | null; routineStretches: Array<{}> } | null>(null);
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
            {stretches ? (
                <div>
                    <h2>{stretches.routineName}</h2>
                    <p>{stretches.routineDescription}</p>
                    <p>Duration: {stretches.totalDuration !== null ? `${stretches.totalDuration} seconds` : 'Not specified'}</p>
                    <p>Stretches: {stretches.routineStretches?.length || 0}</p>
                    <Link to={`/routines/${id}/play`}>Begin Routine</Link>
                </div>
            ) : (
                <p>Loading</p>
            )}
        </div>
    )
}

export default Routine