import logo from '../assets/logo.png'
const Header = () => {
    return (
        <div className='flex items-center py-4 justify-between px-5'>
            <img src={logo} alt="STrack Logo" className='w-10 h-10' />
        </div>
    )
}

export default Header