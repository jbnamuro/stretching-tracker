import Goal from './Components/Goal'
import Streak from './Components/Streak'

const Dashboard = () => {
    const additional = document.getElementsByClassName('menu');
    const menuHeight = additional[0]?.clientHeight || 0;
    return (
        <div className='px-4 mt-8' style={{ marginBottom: menuHeight + 20 }}>
            <h3 className='uppercase tracking-wider font-display font-bold text-primary-dim'>your daily breath</h3>
            <h1 className='font-bold text-display-md tracking-tight'>Today's Goal</h1>
            <Goal />
            <Streak />
        </div>
    )
}

export default Dashboard