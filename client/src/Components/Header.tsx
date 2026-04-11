import React from 'react'
import vector from '../assets/Vector.png'

const Header = () => {
    return (
        <div className='flex items-center py-4 justify-between px-4'>
            <h1 className='text-primary font-semibold text-headline-sm'>Tracking</h1>
            <img src={vector} alt="" className='w-4 h-4' />
        </div>
    )
}

export default Header