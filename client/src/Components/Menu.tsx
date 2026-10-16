import MenuItem from './MenuItem'

const items = [
    { name: "Dashboard", icon: 'self_improvement', linkStr: '/dashboard' },
    { name: "Library", icon: 'spa', linkStr: '/library' },
    { name: "Progress", icon: 'vital_signs', linkStr: '/progress' },
]

const Menu = () => {
    return (
        <div className='flex z-100 menu fixed bottom-0 left-0 w-full gap-2 py-5 '>
            <div className='flex justify-between w-full mx-5 bg-surface-container-lowest border border-primary rounded-4xl'>
                {items.map((item, index) => (
                    <MenuItem name={item.name} icon={item.icon} linkStr={item.linkStr} key={index} />
                ))}
            </div>
        </div>
    )
}

export default Menu