import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../AuthProvider';
import { motion } from 'framer-motion';

export const CreateProject = () => {
  const { name, userId } = useContext(AuthContext)
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
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("createdBy", data.createdBy);
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
        navigate(-1);
        console.log(formData)
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create project.");
    }
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="glass p-5 mb-6 border-l-[3px] border-l-cyan-500">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.25em] mb-1">Project Tracker</p>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Create New Project</h1>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
          {/* Project Name */}
          <div className="glass p-5 border-l-[3px] border-l-cyan-500/50">
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              {...register("title", { required: "Project name is required" })}
              className="input-dark"
            />
            {errors.title && <p className="mt-2 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Document */}
          <div className="glass p-5 border-l-[3px] border-l-violet-500/50">
            <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">
              Project Document <span className="text-red-400">*</span>
            </label>
            <input
              type="file"
              {...register("document", { required: "Project document is required" })}
              className="input-dark file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-violet-500/20 file:text-violet-400 file:font-bold file:text-[10px] file:uppercase file:tracking-widest file:rounded-lg file:cursor-pointer hover:file:bg-violet-500/30"
            />
            {errors.document && <p className="mt-2 text-xs text-red-400">{errors.document.message}</p>}
          </div>

          {/* Created By */}
          <div className="glass p-5 border-l-[3px] border-l-emerald-500/50">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              Created By
            </p>
            <span className="px-3 py-1.5 text-sm bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 font-semibold">{name}</span>
            <input type="hidden" {...register('createdBy')} value={userId} />
          </div>

          {/* Description */}
          <div className="glass p-5 border-l-[3px] border-l-amber-500/50">
            <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Description</label>
            <input
              type="text"
              placeholder="Brief description of the project"
              {...register("description")}
              className="input-dark"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">
                Priority <span className="text-red-400">*</span>
              </label>
              <select
                {...register("priority", { required: "Please select priority" })}
                className="input-dark"
              >
                <option value="">-- Select Priority --</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.priority && <p className="mt-2 text-xs text-red-400">{errors.priority.message}</p>}
            </div>

            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Status</label>
              <select {...register("status")} className="input-dark">
                <option value="">-- Select Status --</option>
                <option value="Working">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                {...register("startDate", { required: "Start date is required" })}
                className="input-dark"
              />
              {errors.startDate && <p className="mt-2 text-xs text-red-400">{errors.startDate.message}</p>}
            </div>

            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Due Date</label>
              <input type="date" {...register("dueDate")} className="input-dark" />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Actions</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost flex-1 py-3 text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-3 text-xs uppercase tracking-widest font-bold"
            >
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};