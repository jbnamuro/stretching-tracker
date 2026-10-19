import yoga from '../assets/yogaIcon.svg'
import Wave from 'react-wavify'


const Loading = () => {
    return (
        <div className='z-50 flex flex-col justify-center items-center fixed top-0 left-0 h-screen w-screen bg-surface-container-lowest'>
            <div
                className='relative size-40 overflow-hidden bg-linear-to-br from-primary-dim to-primary-fixed-dim'
                style={{
                    maskImage: `url("${yoga}")`,
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskImage: `url("${yoga}")`,
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                }}
            >
                <Wave
                    className='absolute inset-0 h-full w-full'
                    fill='#3a6761'
                    paused={false}
                    style={{ display: 'block' }}
                    options={{
                        height: 90,
                        amplitude: 12,
                        speed: 0.15,
                        points: 3
                    }}
                />

            </div>
            <p className='opacity-50 font-light'>Loading...</p>
        </div>
    )
}

export default Loading