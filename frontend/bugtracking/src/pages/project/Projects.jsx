import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Projects = () => {

  const [projects, setproject] = useState([])

  const getProjects = async() => {
    const res = await axios.get('/project/all')
    console.log(res)
    console.log(res.data);
    setproject(res.data)
  }

  useEffect(()=>{
    getProjects()
  },[])


  return (
    <div>
      <div>
        <div>
        <Link to='assignproject'>Assign</Link><br />
        <Link to='createproject'>ADD</Link><br />
        <Link to='editproject'>EDIT</Link><br />
        <Link to='projectdetails'>DETAILS</Link>
        </div>
      </div>
      <div>
        
      </div>
    </div>


  )
}
