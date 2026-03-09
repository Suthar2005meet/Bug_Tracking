import { Link } from 'react-router-dom'

export const Bugs = () => {
  return (
    <div>
      <div className='border-2 p-3 flex justify-between'>
        <input type="search" placeholder='Search Bug' className='border-1 p-1 border-gray-400 rounded'/>
        
        </div>
        
        <Link to='bugdetail'>Details</Link><br />
        <Link to='editbug'>Edit</Link><br />
    </div>
  )
}
