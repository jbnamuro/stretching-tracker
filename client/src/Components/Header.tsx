import logo from '../assets/logo.png'
const Header = () => {
    return (
        <div className='flex mb-5 drop-shadow-md bg-surface-container-lowest items-center py-4 justify-between px-5'>
            <h1 className='text-primary text-2xl font-bold'>STrack</h1>
            <img src={logo} alt="STrack Logo" className='w-10 h-10' />
        </div>
    )
}

export default Header