import React from 'react'
import MenuItem from './MenuItem'

const items = [
    { name: "Dashboard", img: '', linkStr: '/dashboard' },
    { name: "Timer", img: '', linkStr: '/timer' },
    { name: "Calendar", img: '', linkStr: '/timer' },
    { name: "Library", img: '', linkStr: '/timer' }
]

const Menu = () => {
    return (
        <div className='flex fixed bottom-0 left-0 w-full gap-2 py-5 bg-white px-2'>
            {items.map((item, index) => (
                <MenuItem name={item.name} linkStr={item.linkStr} key={index} />
            ))}
        </div>
    )
}

export default Menu