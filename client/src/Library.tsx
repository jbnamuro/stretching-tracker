import { useEffect, useState } from 'react'
import API from './lib/api';
import { Link } from 'react-router-dom';
import Loading from './Components/Loading';

const Library = () => {

    const [routine, setRoutine] = useState<Array<{
        routineName: string
        routineDescription: string | null
        routineID: string
        totalDuration: number
        stretchCount: number
    }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
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

                const routines: Array<{
                    routineName: string
                    routineDescription: string | null
                    routineID: string
                    totalDuration: number
                    stretchCount: number
                }> = [];

                for (let i = 0; i < entries.length && i < 4; i++) {
                    routines.push({
                        routineName: entries[i].name,
                        routineDescription: entries[i].description,
                        routineID: entries[i].id,
                        totalDuration: entries[i].totalDuration,
                        stretchCount: entries[i]._count.routineStretches
                    });
                }

                setRoutine(routines);
            }
            catch (err) {
                console.error(err);
                setLoadError(true);
            }
            finally {
                setIsLoading(false);
            }
        }
        getLibrary()
    }, [])
    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : loadError ? (
                <p className='mx-5 mt-5 text-center text-on-surface-variant'>Could not load routines. Please try again.</p>
            ) : routine.length > 0 ? (
                <div style={{ marginBottom: menuHeight + 20 }}>
                    <p className='mb-3 ml-5 text-2xl font-medium'>All sequences</p>
                    {
                        routine.map((entry, index) => (
                            <div key={entry.routineID} className='mb-5 bg-surface-container-low drop-shadow-lg rounded-xl p-5 mx-5 flex gap-4'>
                                <div className='bg-primary-fixed-dim h-fit py-1 px-3 flex justify-center items-center rounded-lg'>
                                    <p className='text-primary'>{String(index + 1).padStart(2, '0')}</p>
                                </div>
                                <div>
                                    <p className='text-lg font-medium mb-2'>{entry.routineName}</p>
                                    <p className='text-sm mb-2'>{entry.routineDescription}</p>
                                    <div className='mb-3 flex gap-6 text-sm'>
                                        <p>Duration: <span className='text-primary'>{Math.floor(entry.totalDuration / 60).toString().padStart(2, '0')}:{(entry.totalDuration % 60).toString().padStart(2, '0')}</span></p>
                                        <p>Stretches: <span className='text-primary'>{entry.stretchCount}</span></p>
                                    </div>
                                    <Link to={`/routines/${entry.routineID}/play`}><p className='text-sm bg-surface-container-highest w-fit px-2 rounded-2xl py-1 hover:text-primary hover:bg-surface-container-high ease-in-out duration-300'>Begin Routine</p></Link>
                                </div>
                            </div>
                        ))
                    }
                </div >
            ) : (
                <p className='mx-5 mt-5 text-center text-on-surface-variant'>No routines available yet.</p>
            )}
        </div>

    );
};

export default Library