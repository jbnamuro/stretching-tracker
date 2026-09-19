import { useEffect, useState } from 'react'
import API from './lib/api';

const Library = () => {

    const [routine, setRoutine] = useState<Array<{ routineName: string; routineDescription: string | null }>>([]);
    useEffect(() => {
        const getLibrary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API}/routines`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                const entries = data.data.routines;

                const routines: Array<{ routineName: string; routineDescription: string | null }> = [];

                for (let i = 0; i < entries.length && i < 3; i++) {
                    routines.push({
                        routineName: entries[i].name,
                        routineDescription: entries[i].description,
                    });
                }

                setRoutine(routines);
            }
            catch (err) {
                console.error(err);
            }
        }
        getLibrary()
    }, [])
    return (
        <div>
            {routine.map((entry, index) => (
                <div key={index}>
                    <p>{entry.routineName}</p>
                    <p>{entry.routineDescription}</p>
                </div>
            ))}
        </div>
    );
};

export default Library