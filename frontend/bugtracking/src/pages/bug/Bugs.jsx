import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const Bugs = () => {

  const {bugs, setbugs} = useState([])

  const getBugs = async() => {
    const res = await axios.get('/bug/all')
    console.log(res)
    console.log(res.data)
    console.log(res.data.data);
    
    setbugs(res.data.data)
  }
  
  useEffect(()=>{
    getBugs()
  },[])

  return (
    <div>
      <div className='border-2 p-3 flex justify-between'>
        <input type="search" placeholder='Search Bug' className='border-1 p-1 border-gray-400 rounded'/>
      </div>
        <div>
          {/* {
            bugs.map((bug)=>{
              return <div>
                <div className='border-2 m-3'>
                  <h2>Bug Title : {bug.title}</h2>
                </div>
              </div>
            })
          } */}
        </div>
        <Link to='bugdetail'>Details</Link><br />
        <Link to='editbug'>Edit</Link><br />
    </div>
  )
}
