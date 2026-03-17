import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const CreateBug = () => {

  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm()
  // const submitHandle = async (data) =>{
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", data.image[0]);

  //     console.log(data);
  //     const res = await axios.post("/bug/create", data);
  //     console.log(res);
  //     if (res.status == 201) {
  //       toast.success("Bug Created Successfully!");
  //       navigate("/admin/bug"); // Uncomment if you have navigation
  //     }
  //   }
  //   catch(err){
  //     console.log(err);
  //     toast.error(err.response?.data?.message || "Failed to create bug");
  //   }
  // }


  const submitHandle = async (data) => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("projectName", data.projectName);
    formData.append("type", data.type);
    formData.append("priority", data.priority);
    formData.append("reproduce", data.reproduce);
    formData.append("expectedResult", data.expectedResult);
    formData.append("dueDate", data.dueDate);

    // 🔥 IMPORTANT
    formData.append("image", data.image[0]);

    const res = await axios.post("/bug/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 201) {
      toast.success("Bug Created Successfully!");
      navigate("/admin/bug");
    }

  } catch (err) {
    console.log(err);
    toast.error(err.response?.data?.message || "Failed to create bug");
  }
};
  const fetchAllProjects = async () => {
    try {
      const res = await axios.get("/project/all");
      console.log(res.data);
      console.log(res.data.data);
      setProjects(res.data.data);
      // You can set the projects in state here if you want to populate a dropdown
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch projects");
    }
  }

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <div className='flex justify-center bg-gradient-to-br from-purple-500 to-blue-300 '>
      <div className='border-1 bg-white p-8 rounded-2xl shadow-xl m-8 w-150 justify-center'>
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">Create Bug</h1>
        <form onSubmit={handleSubmit(submitHandle)}>
          <div>
            <label className='block text-gray-600 font-bold'>Bug Title : </label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type="text" {...register('title', { required: 'Bug title is required' })}/>
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Description : </label>
            <textarea className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('description', { required: 'Description is required' })}></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Image : </label>
            <input type="file" accept="image/*" className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('image', { required: "Image is required" })} />
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Select the project : </label>
            <select className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('projectName', { required: 'Project selection is required' })}>
              {
                projects.map((project) => {
                  return <option key={project._id} value={project._id}>{project.projectName}</option>;
                })
              }
            </select>
            {errors.project && <p className="text-red-500 text-sm">{errors.project.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Select the component : </label>
            <select className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('type', { required: 'Component type is required' })}>
              <option value=""></option>
              <option value="UI based">UI Based</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="API">API</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Priority : </label>
            <select className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('priority', { required: 'Priority is required' })}>
              <option value=""></option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Step To Reproduce</label>
            <textarea className='border-1 w-full px-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('reproduce', { required: 'Steps to reproduce are required' })} placeholder=''></textarea>
            {errors.reproduce && <p className="text-red-500 text-sm">{errors.reproduce.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Expected Result</label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type="text" {...register('expectedResult', { required: 'Expected result is required' })} placeholder='Expected results'/>
            {errors.expectedResult && <p className="text-red-500 text-sm">{errors.expectedResult.message}</p>}
          </div>
          <div>
            <label className='block text-gray-600 font-bold'>Due Date</label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' type='date'  {...register('dueDate', { required: 'Due date is required' })} placeholder='Enter the date'/>
            {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
          </div>
          {/* <div>
            <label className='block text-gray-600 font-bold'>Upload File/Image : </label>
            <input className='border-1 border-gray-400 w-full px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400' {...register('uploadedDoc')} type='file' />
          </div><br /> */}
          <div>
            <button type="submit" className='border-1 w-full px-2 rounded-lg bg-green-400 font-bold'>Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
}
