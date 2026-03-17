import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export const Editbug = () => {

  const navigate = useNavigate()
  const { id } = useParams()

  const { register, handleSubmit, reset } = useForm()

  const [bug, setBug] = useState(null)

  // 🔥 Fetch bug data
  const getData = async () => {
    try {
      const res = await axios.get(`/bug/bug/${id}`)
      setBug(res.data.data)
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch bug data")
    }
  }

  // 🔥 Update bug
  const submitHandle = async (data) => {
    try {
      const res = await axios.put(`/bug/update/${id}`, data)

      if (res.status === 200) {
        toast.success("Bug Updated Successfully!")
        navigate('/admin/bug')
      }

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Update failed")
    }
  }

  // 🔥 Load data on id change
  useEffect(() => {
    getData()
  }, [id])

  // 🔥 Set form values after data comes
  useEffect(() => {
    if (bug) {
      reset(bug)
    }
  }, [bug, reset])

  // 🔥 Loading state
  if (!bug) {
    return <p className="text-center mt-10">Loading...</p>
  }

  return (
    <div className='flex justify-center bg-gray-100 min-h-screen'>
      <div className='bg-white p-8 rounded-xl shadow-lg w-[400px] mt-10'>

        <h2 className='text-xl font-bold text-center mb-6'>Edit Bug</h2>

        <form onSubmit={handleSubmit(submitHandle)}>

          <div className="mb-3">
            <label className="font-semibold">Bug Title</label>
            <input
              type="text"
              className="border w-full px-2 py-1 rounded"
              {...register("title", { required: true })}
            />
          </div>

          <div className="mb-3">
            <label className="font-semibold">Description</label>
            <input
              type="text"
              className="border w-full px-2 py-1 rounded"
              {...register("description", { required: true })}
            />
          </div>

          <div className="mb-3">
            <label className="font-semibold">Status</label>
            <select
              className="border w-full px-2 py-1 rounded"
              {...register("status")}
            >
              <option value="open">Open</option>
              <option value="In progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="font-semibold">Priority</label>
            <select
              className="border w-full px-2 py-1 rounded"
              {...register("priority")}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="font-semibold">Assigned To</label>
            <input
              type="text"
              className="border w-full px-2 py-1 rounded"
              {...register("assignedTo")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Update Bug
          </button>

        </form>
      </div>
    </div>
  )
}