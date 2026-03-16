import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import axios from 'axios' 


export const Editbug = () => {

  const {register,handleSubmit} = useForm()
  const [bug, setBug] = useState()
  const {id} = useParams()

  const getData = async () =>{
    try {
      console.log(id);
      const res = await axios.get(`/bug/bug/${id}`);
      console.log(res);
      console.log(res.data);
      setBug(res.data.data)
    } catch (error) {
      console.log(error);
    }
  }

  const submitHandle = async (data) =>{
    console.log(data);
    const savedData = await axios.put(`/bug/update/${id}`,data)
    console.log(savedData);
  }

  useEffect(() => {
    getData()
  },[])
  return (
    <div>
      <div>
        <form onClick={handleSubmit(submitHandle)}>
          <div>
            <label>Bug Title : </label>
            <input type="text" {...register("title")} defaultValue={bug?.title} />
          </div>
          <div>
            <label>Bug Description : </label>
            <input type="text" {...register("description")} defaultValue={bug?.description} />
          </div>
          <div>
            <label>Bug Status : </label>
            <select name="status" id="" {...register("status")} defaultValue={bug?.status}>
              <option value="open">Open</option>
              <option value="in Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label>Bug Priority : </label>
            <select name="priority" id="" {...register("priority")} defaultValue={bug?.priority}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label>Bug Assigned To : </label>
            <input type="text" {...register("assignedTo")} defaultValue={bug?.assignedTo} />
          </div>
          <div>
            <button type='submit'>Update Bug</button> 
          </div>
        </form>
      </div>
    </div>
    
  )
}
