import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const AddUser = () => {

    const navigate = useNavigate()
    const {register,handleSubmit,watch} = useForm()
    const submitHandle = async (data) => {
        try{
            const res = await axios.post("/user/create",data)
            console.log(data);
            console.log(res);
            if(res.status = 201 ){
                navigate("/admin/user")
                toast.success("Add User Successfully")
            }else{

            }
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div className='flex justify-center bg-gradient-to-br from-blue-300 to-red-200'>
        <div className='border-1 bg-white p-8 m-8 rounded-2xl shadow-xl w-100 justify-center'>
            <h1 className='text-2xl font-bold text-center mb-6 text-gray-700'>Add User</h1>
            <form onSubmit={handleSubmit(submitHandle)}>
                <div>
                    <label className='block text-gray-600 font-bold'>User Name : </label>
                    <input type="text" className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' placeholder='Enter User Name' {...register('username')} />
                </div>
                <div>
                    <label className='block text-gray-600 font-bold'>Email</label>
                    <input type="email" className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' placeholder='Enter User EmailID' {...register('email')} />
                </div>
                <div>
                    <label className='block text-gray-600 font-bold'>Password</label>
                    <input type="text" className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' placeholder='Enter User Password' {...register('password')} />
                </div>
                <div>
                    <label className='block text-gray-600 font-bold'>Confirm Password</label>
                    <input type="text" className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' placeholder='Enter Upper Password' {...register('confirmpassword')} />
                </div>
                <div>
                    <label className='block text-gray-600 font-bold'>Mobile Number</label>
                    <input type="text" className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' placeholder='Enter Upper Password' {...register('mobileNo')} />
                </div>
                <div>
                    <label className='block text-gray-600 font-bold'>Role</label>
                    <select className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('role')}>
                        <option value="">--Select Role--</option>
                        <option value="ProjectManager">Project Manager</option>
                        <option value="Developer">Developer</option>
                        <option value="Tester">Tester</option>
                    </select>
                </div>
                <div>
                    <label className='block text-gray-600 font-bold'>Upload Image</label>
                    <input type="file"  className='border-1 w-full border-gray-400 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('image')} />
                </div><br />
                <div>
                    <input type="submit"  className='border-1 w-full px-2 rounded-lg bg-green-400 font-bold'/>
                </div>
            </form>
        </div>
    </div>
  )
}
