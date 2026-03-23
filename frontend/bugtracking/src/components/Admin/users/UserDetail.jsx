import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const UserDetail = () => {

  const [user, setuser] = useState()
  const { id } = useParams()


  const getuser = async () => {
    try{
      const res = await axios.get(`/user/details/${id}`)
      console.log(res.data.data)
      setuser(res.data.data)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getuser();
  },[])

  return (
    <div>
        <h1>UserDetail</h1>
        {
          user ? (
            <>
              <h1>Name : {user.name}</h1>
              <h2>Email : {user.email}</h2>
              <h2>Mobile No : {user.mobileno}</h2>
              <h2>Role : {user.role}</h2>
            </>
          ) : (
            <p>Loadind ...</p>
          )
        }
    </div>
  )
}
