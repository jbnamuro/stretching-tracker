import React from 'react'
import MenuItem from './MenuItem'

const items = [
    { name: "Dashboard", img: '', linkStr: '/dashboard' },
    { name: "Library", img: '', linkStr: '/library' },
    { name: "Generate", img: '', linkStr: '/generate' },
]

const Menu = () => {
    return (
        <div className='flex z-100 menu fixed bottom-0 left-0 w-full gap-2 py-5 bg-white px-2'>
            {items.map((item, index) => (
                <MenuItem name={item.name} linkStr={item.linkStr} key={index} />
            ))}
        </div>
    )
}

export default Menu