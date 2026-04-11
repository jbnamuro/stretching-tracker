import React from 'react'
import { Link } from 'react-router-dom';
import vector from '../assets/Vector.png'


const MenuItem = (props: { name: string; linkStr: string }) => {
    return (
        <Link to={props.linkStr} className='w-1/3'>
            <div className='flex flex-col gap-2 w-full justify-center items-center hover:bg-surface-container-high py-3 rounded-xl cursor-pointer transition-colors duration-200 ease-in group'>
                <img src={vector} alt="" className='w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-200' />
                <p className='font-body text-label-sm font-medium tracking-category uppercase text-on-surface-variant group-hover:text-primary transition-colors duration-200 ease-in'>{props.name}</p>
            </div>
        </Link>
    )
}

export default MenuItem