import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export const AddComment = () => {

    const [bug,setbug] = useState()
    const { id } = useParams()
    const{register,handleSubmit} = useForm()
    const navigate = useNavigate()

    const getData = async () => {
        try{
            const res = await axios.get(`/bug/bug/${id}`)
            console.log(res.data.data)
            setbug(res.data.data)
        }catch(err){
            console.log(err)
        }
    }

    const submitHandle = async(data) => {
        try{
            console.log(data)
            // const res = await axios.post(`/comment/create/${id}`,data)
            // console.log(res)
            // navigate(-1)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        getData()
    },[])



    return (
        <div>
            <form onSubmit={handleSubmit(submitHandle)}>
                <h1>Add Comment</h1>
                <div>
                    <label>Bug Name : {bug?.title}</label>
                    <input type="text" {...register("bugId")} />
                </div>
                <div>
                    {/* <label>Developer Name : {bug?.}</label> */}
                </div>
            </form>
        </div>
    );
};
