import { useEffect, useState } from 'react'
import API from './lib/api';
import { Link } from 'react-router-dom';

const Library = () => {

    const [routine, setRoutine] = useState<Array<{ routineName: string; routineDescription: string | null; routineID: string }>>([]);
    const additional = document.getElementsByClassName('menu');
    const menuHeight = additional[0]?.clientHeight || 0;

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

                for (let i = 0; i < entries.length && i < 4; i++) {
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
            {routine ? (
                <div style={{ marginBottom: menuHeight + 20 }}>
                    <p className='mb-5 ml-5 text-2xl font-medium'>All sequences</p>
                    {
                        routine.map((entry, index) => (
                            <div>
                                <div key={index} className='mb-5 bg-red-200 rounded-xl p-5 mx-5 flex gap-2'>
                                    <img src="" alt="hold" />
                                    <div>
                                        <p className='text-lg font-medium mb-2'>{entry.routineName}</p>
                                        <p className='text-sm mb-2'>{entry.routineDescription}</p>
                                        <Link to={`/routines/${entry.routineID}`}>View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div >
            ) : <p>Loading</p>}
        </div>

    );
};

export default Library