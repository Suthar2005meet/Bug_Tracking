import axios from 'axios'
import React, { useEffect } from 'react'

export const ProfileUser = () => {

    const getUserData = async() => {
        try{
            const res = await axios.get(`/user/details/${id}`)
            console.log(res.data.data)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getUserData();
    },[])

    return (
        <div>

        </div>
    )
}
