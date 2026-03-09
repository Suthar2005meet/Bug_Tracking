import React from 'react'
import { Link } from 'react-router-dom'

export const Projects = () => {
  return (
    <div>
        <Link to='assignproject'>Assign</Link><br />
        <Link to='createproject'>ADD</Link><br />
        <Link to='editproject'>EDIT</Link><br />
        <Link to='projectdetails'>DETAILS</Link>
    </div>
  )
}
