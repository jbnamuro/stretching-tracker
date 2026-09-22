import { useEffect, useState } from 'react'
import API from './lib/api';
import { Link } from 'react-router-dom';

const Library = () => {

    const [routine, setRoutine] = useState<Array<{ routineName: string; routineDescription: string | null; routineID: string }>>([]);
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

                const routines: Array<{ routineName: string; routineDescription: string | null; routineID: string }> = [];

                for (let i = 0; i < entries.length && i < 3; i++) {
                    routines.push({
                        routineName: entries[i].name,
                        routineDescription: entries[i].description,
                        routineID: entries[i].id
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
                <div key={index} className='mb-5'>
                    <p>{entry.routineName}</p>
                    <p>{entry.routineDescription}</p>
                    <Link to={`/routines/${entry.routineID}`}>View Details</Link>
                </div>
            ))}
        </div>

    );
};

export default Library