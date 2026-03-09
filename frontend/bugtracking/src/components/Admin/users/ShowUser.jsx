import React from 'react'
import { Link } from 'react-router-dom'

export const ShowUser = () => {
  return (
    <div>
      <div>
        <div className='border-2 w-full py-3 flex justify-between'>
          <input className='border-1 py-1 ml-5 rounded' type="Search" placeholder='Search '/>
          <Link className='pr-5 pl-5 py-1 ml-150 border-1 rounded-full bg-green-300 hover:bg-green-400 font-bold' to='adduser'>Add</Link><br />
        </div>
      </div>
      <Link to='edituser'>Edit</Link><br />
      <Link to='userdetails'>Details</Link><br />
    </div>
  )
}
