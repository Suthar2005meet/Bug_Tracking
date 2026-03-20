import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const CreateProject = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [developer, setdeveloper] = useState([]);

  const getDeveloper = async () => {
    try {
      const res = await axios.get('/user/developer');
      console.log(res.data.data);
      setdeveloper(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDeveloper();
  }, []);

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

      formData.append("document", data.document[0]);
      console.log(data);

      const res = await axios.post("/project/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

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
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-white border-l-4 border-amber-400 pl-5 pr-4 py-4 shadow-sm">
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">Project Tracker</p>
          <h1 className="text-2xl font-mono font-bold text-slate-800">Create New Project</h1>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-4">

          {/* Project Name */}
          <div className="bg-sky-50 border border-sky-200 border-l-4 border-l-sky-500 p-5 hover:bg-sky-100 hover:border-l-sky-600">
            <label className="block text-xs font-mono text-sky-600 uppercase tracking-widest mb-2">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              {...register("projectName", { required: "Project name is required" })}
              className="w-full bg-white border border-sky-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
            {errors.projectName && (
              <p className="mt-2 text-xs font-mono text-red-500">{errors.projectName.message}</p>
            )}
          </div>

          {/* Project Document */}
          <div className="bg-violet-50 border border-violet-200 border-l-4 border-l-violet-500 p-5 hover:bg-violet-100 hover:border-l-violet-600">
            <label className="block text-xs font-mono text-violet-600 uppercase tracking-widest mb-2">
              Project Document <span className="text-red-400">*</span>
            </label>
            <input
              type="file"
              {...register("document", { required: "Project document is required" })}
              className="w-full bg-white border border-violet-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-violet-100 file:text-violet-700 file:font-mono file:text-xs file:uppercase file:tracking-widest hover:file:bg-violet-200"
            />
            {errors.document && (
              <p className="mt-2 text-xs font-mono text-red-500">{errors.document.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 p-5 hover:bg-orange-100 hover:border-l-orange-600">
            <label className="block text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">
              Description
            </label>
            <input
              type="text"
              placeholder="Brief description of the project"
              {...register("description")}
              className="w-full bg-white border border-orange-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
            />
          </div>

          {/* Assigned Members */}
          <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 p-5 hover:bg-rose-100 hover:border-l-rose-600">
            <label className="block text-xs font-mono text-rose-600 uppercase tracking-widest mb-3">
              Assign Members <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {developer.map((dev) => (
                <label
                  key={dev._id}
                  className="flex items-center gap-2 bg-white border border-rose-200 px-3 py-2 cursor-pointer hover:bg-rose-50 hover:border-rose-400"
                >
                  <input
                    type="checkbox"
                    value={dev._id}
                    {...register("assignedMembers", { required: true })}
                    className="accent-rose-500"
                  />
                  <span className="font-mono text-sm text-slate-700">{dev.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-5 hover:bg-amber-100 hover:border-l-amber-600">
              <label className="block text-xs font-mono text-amber-600 uppercase tracking-widest mb-2">
                Priority <span className="text-red-400">*</span>
              </label>
              <select
                {...register("priority", { required: "Please select priority" })}
                className="w-full bg-white border border-amber-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              >
                <option value="">-- Select Priority --</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <p className="mt-2 text-xs font-mono text-red-500">{errors.priority.message}</p>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 p-5 hover:bg-emerald-100 hover:border-l-emerald-600">
              <label className="block text-xs font-mono text-emerald-600 uppercase tracking-widest mb-2">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full bg-white border border-emerald-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
              >
                <option value="">-- Select Status --</option>
                <option value="Working">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

          </div>

          {/* Start Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-cyan-50 border border-cyan-200 border-l-4 border-l-cyan-500 p-5 hover:bg-cyan-100 hover:border-l-cyan-600">
              <label className="block text-xs font-mono text-cyan-600 uppercase tracking-widest mb-2">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                {...register("startDate", { required: "Start date is required" })}
                className="w-full bg-white border border-cyan-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
              />
              {errors.startDate && (
                <p className="mt-2 text-xs font-mono text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 border-l-4 border-l-indigo-500 p-5 hover:bg-indigo-100 hover:border-l-indigo-600">
              <label className="block text-xs font-mono text-indigo-600 uppercase tracking-widest mb-2">
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full bg-white border border-indigo-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
              />
            </div>

          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Actions</span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/project')}
              className="flex-1 py-3 bg-white text-slate-600 font-mono text-xs uppercase tracking-widest border border-slate-300 border-l-4 border-l-slate-400 hover:bg-slate-50 hover:text-slate-800 hover:border-l-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-amber-400 text-slate-900 font-mono text-xs uppercase tracking-widest font-bold border border-amber-300 border-l-4 border-l-amber-600 hover:bg-amber-500 hover:border-l-amber-700"
            >
              Create Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};