import { Link } from 'react-router-dom';


const MenuItem = (props: { name: string; icon: string; linkStr: string }) => {
    return (
        <Link to={props.linkStr} className='w-1/3'>
            <div className='flex flex-col gap-2 w-full justify-center items-center hover:bg-surface-container-high py-3 rounded-4xl cursor-pointer transition-colors duration-200 ease-in group'>
                <span aria-hidden="true" className='material-symbols-outlined text-[24px] opacity-60 group-hover:opacity-100 transition-opacity duration-200'>{props.icon}</span>
                <p className='font-body text-label-sm font-medium tracking-category uppercase text-on-surface-variant group-hover:text-primary transition-colors duration-200 ease-in'>{props.name}</p>
            </div>
        </Link>
    )
}

export default MenuItem