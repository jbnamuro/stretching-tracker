import { useEffect, useState } from 'react'
import API from './lib/api';
import { Link } from 'react-router-dom';
import Loading from './Components/Loading';
import clock from './assets/clock.svg'
import arm from './assets/arm.svg'
import play from './assets/playBtn.svg'

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
    const featuredRoutine = routine.length > 0
        ? routine[Math.floor(Date.now() / 86400000) % routine.length]
        : undefined;

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
                    <div>
                        <h1 className='ml-5 font-semibold text-4xl'>Routine Library</h1>
                        <p className='ml-5 mt-1 text-md mb-5'>Curated movements designed to restore balance, flexibility, and daily mobility.</p>
                    </div>
                    <div className='mx-5 mb-5 bg-linear-to-br from-primary-fixed-dim to-surface-container-low p-5 rounded-3xl'>
                        <h2 className='font-semibold text-sm text-primary bg-surface-container-lowest w-fit px-3 py-1 rounded-3xl'>FEATURED STRETCH</h2>
                        <p className='mt-5 text-2xl font-semibold'>{featuredRoutine?.routineName}</p>
                        <p className='mt-1 text-md text-on-surface-variant'>{featuredRoutine?.routineDescription}</p>
                        <div className='mt-5 flex gap-3'>
                            <div className='flex items-center gap-2 bg-surface-container-lowest w-fit rounded-lg px-3 py-1 text-primary'>
                                <img className='h-5' src={clock} alt="Clock" />
                                <p className='text-sm font-medium'>{featuredRoutine ? Math.round(featuredRoutine.totalDuration / 60) : 0} MIN</p>
                            </div>
                            <div className='flex items-center gap-2 bg-surface-container-lowest w-fit rounded-lg px-3 py-1 text-primary'>
                                <img className='h-5' src={arm} alt="Arm" />
                                <p className='text-sm font-medium'>{featuredRoutine ? featuredRoutine.stretchCount : 0} STRETCHES</p>
                            </div>
                        </div>
                        <Link to={`/routines/${featuredRoutine?.routineID}/play`}>
                            <div className='flex hover:bg-primary-dim mt-5 gap-2 items-center justify-center bg-primary px-5 py-3 rounded-full'>
                                <img src={play} alt="Play" />
                                <button className=' text-on-primary font-semibold'>Start Routine</button>
                            </div>
                        </Link>

                    </div>
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
            )
            }
        </div >

    );
};

export default Library