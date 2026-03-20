import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const CreateProject = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [developer, setdeveloper] = useState([])

  const getDeveloper = async () => {
    try{
      const res = await axios.get('/user/developer')
      console.log(res.data.data)
      setdeveloper(res.data.data)
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    getDeveloper()
  },[])

  const submitHandle = async (data) => {
  try {
    const formData = new FormData();

    formData.append("projectName", data.projectName);
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("status", data.status);
    formData.append("startDate", data.startDate);
    formData.append("dueDate", data.dueDate);
    
    if (data.assignedMembers) {
      data.assignedMembers.forEach((member) => {
        formData.append("assignedMembers", member);
      });
    }



    // Important for file
    formData.append("document", data.document[0]);
    console.log(data)
    const res = await axios.post("/project/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    console.log(formData);
    
    if (res.status === 201) {
      toast.success("Project created successfully!");
      navigate('/admin/project');
    }

  } catch (error) {
    console.log(error);
    toast.error("Failed to create project.");
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
            <h1 className="text-2xl font-bold text-white">Create New Project</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitHandle)} className="p-6 sm:p-8 space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                {...register("projectName", { required: "Project name is required" })}
              />
              {errors.ProjectName && (
                <p className="mt-1 text-sm text-red-600">{errors.ProjectName.message}</p>
              )}
            </div>

            {/* Project Document */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Document <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                {...register("document", { required: "Project Document is required" })}
              />
              {errors.document && (
                <p className="mt-1 text-sm text-red-600">{errors.document.message}</p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Brief description of the project"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                {...register("description")}
              />
            </div>

              {/* assigned members */}
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
            {developer.map((dev) => (
              <label
                key={dev._id}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={dev._id} // store ID in database
                  {...register("assignedMembers", { required: true })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />

                <span>{dev.name}</span>
              </label>
            ))}
          </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition"
                  {...register("priority", { required: "Please select priority" })}
                >
                  <option value="">-- Select Priority --</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {errors.ProjectPriority && (
                  <p className="mt-1 text-sm text-red-600">{errors.ProjectPriority.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white outline-none transition"
                  {...register("status")}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Working">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  {...register("startDate", { required: "Start date is required" })}
                />
                {errors.StartDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.StartDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  {...register("dueDate")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};