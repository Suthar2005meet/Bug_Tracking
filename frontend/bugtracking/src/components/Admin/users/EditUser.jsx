import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

export const EditUser = () => {

  const [user, setuser] = useState()
  const {register,handleSubmit,  reset} = useForm()
  const { id } = useParams()

  const getData = async() => {
    try{
      const res = await axios.get(`/user/details/${id}`)
      console.log(res.data.data)
      setuser(res.data.data)
      reset(res.data.data)
    }catch(err){
      console.log(err)
    }
  }

  const submitHandle = async(data) => {
    try{
      const res = await axios.put(`/user/update/:id`,data)

    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getData();
  },[])

  return (
    <div>
        <form onSubmit={handleSubmit(submitHandle)}>
          <div>
            <label>Name : </label>
            <input type="text" {...register('name',{required:true})}/>
          </div>
          <div>
            <label>Email : </label>
            <input type="text" {...register('email',{required:true})} />
          </div>
          <div>
            <label>Mobile No. </label>
            <input type="text" {...register('mobileno',{required:true})}/>
          </div>
          <div>
            
          </div>
          <div>
            <input type="submit" />
          </div>
        </form>
    </div>
  )
}
