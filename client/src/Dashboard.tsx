import Goal from './Components/Goal'

const Dashboard = () => {
    return (
        <div className='px-4 mt-8'>
            <h3 className='uppercase tracking-wider font-display font-bold text-primary-dim'>your daily breath</h3>
            <h1 className='font-bold text-display-md tracking-tight'>Today's Goal</h1>
            <Goal />
        </div>
    )
}

export default Dashboard