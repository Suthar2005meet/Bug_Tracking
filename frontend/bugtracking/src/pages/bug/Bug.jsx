import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../AuthProvider'

export const Bug = () => {
    const { userId } = useContext(AuthContext)
    const [loading, setloading] = useState(true)
    const [bugs, setbugs] = useState([])

    const getUserByBug = async() => {
        console.log(userId)
        try{
            const res = await axios.get(`bug/user/${userId}`)
            console.log(res.data.data)
            setbugs(res.data.data || []);
        }catch(err){
            console.log(err)
            setbugs([])
        }finally{
            setloading(false)
        }
    };

    useEffect(()=>{
        if(!userId){
            setloading(false)
            return
        }
        getUserByBug()
    },[userId])

    if(loading){
        return <div>Loading...</div>
    }

  return (
    <div>Bug</div>
  )
}
