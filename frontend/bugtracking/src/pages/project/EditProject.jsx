import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export const EditProject = () => {
  const { register, handleSubmit, reset } = useForm();
  const [developer, setdeveloper] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(`/project/details/${id}`);
      console.log(res.data.data);
      reset(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllDeveloper = async () => {
    try {
      const res = await axios.get('/user/developer');
      console.log(res.data.data);
      setdeveloper(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitHandle = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/project/update/${id}`, data);
      navigate(-1);
      toast.success("Update Data Successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
      fetchAllDeveloper();
    }
  }, [id]);

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
          <h2 className="text-xl font-extrabold text-white">Edit Project</h2>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
          {/* Project Name */}
          <div className="glass p-5 border-l-[3px] border-l-cyan-500/50">
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Project Name</label>
            <input type="text" {...register('title')} className="input-dark" />
          </div>

          {/* Description */}
          <div className="glass p-5 border-l-[3px] border-l-amber-500/50">
            <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Description</label>
            <input type="text" {...register('description')} className="input-dark" />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Priority</label>
              <select {...register('priority')} className="input-dark">
                <option value=""></option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Status</label>
              <select {...register('status')} className="input-dark">
                <option value=""></option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Start Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Start Date</label>
              <input type="date" {...register('startDate')} className="input-dark" />
            </div>
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Due Date</label>
              <input type="date" {...register('dueDate')} className="input-dark" />
            </div>
          </div>

          {/* Document */}
          <div className="glass p-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Document</label>
            <input
              type="file"
              {...register('document')}
              className="input-dark file:mr-3 file:py-1.5 file:px-4 file:border-0 file:bg-white/[0.06] file:text-slate-400 file:font-bold file:text-[10px] file:uppercase file:tracking-widest file:rounded-lg file:cursor-pointer hover:file:bg-white/[0.1]"
            />
          </div>

          {/* Divider + Buttons */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Actions</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1 py-3 text-xs uppercase tracking-widest">Cancel</button>
            <button type="submit" disabled={loading} className={`btn-primary flex-1 py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : 'Update Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};