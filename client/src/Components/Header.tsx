import logo from '../assets/logo.png'

const Header = ({ onLogout }: { onLogout: () => void }) => {
    return (
        <div className='flex mb-5 drop-shadow-md bg-surface-container-lowest items-center py-4 justify-between px-5'>
            {/* <h1 className='text-primary text-2xl font-bold'>STrack</h1> */}
            <div className='flex items-center gap-4'>
                <img src={logo} alt="STrack Logo" className='w-10 h-10' />
            </div>
            <button
                type='button'
                onClick={onLogout}
                className='rounded-full border border-outline-variant px-4 py-2 text-sm font-semibold hover:bg-surface-container-low'
            >
                Log out
            </button>
        </div>
    )
}

export default Header