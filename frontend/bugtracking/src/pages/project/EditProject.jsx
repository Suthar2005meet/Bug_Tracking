import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const EditProject = () => {

  const { register, handleSubmit, reset } = useForm();
  const [developer, setdeveloper] = useState([]);
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
    try {
      const res = await axios.put(`/project/update/${id}`, data);
      navigate(-1);
      toast.success("Update Data Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
      fetchAllDeveloper();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-white border-l-4 border-amber-400 pl-5 pr-4 py-4 shadow-sm">
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">Project Tracker</p>
          <h2 className="text-2xl font-mono font-bold text-slate-800">Edit Project</h2>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-4">

          {/* Project Name */}
          <div className="bg-sky-50 border border-sky-200 border-l-4 border-l-sky-500 p-5 hover:bg-sky-100 hover:border-l-sky-600">
            <label className="block text-xs font-mono text-sky-600 uppercase tracking-widest mb-2">
              Project Name
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full bg-white border border-sky-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
          </div>

          {/* Description */}
          <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 p-5 hover:bg-orange-100 hover:border-l-orange-600">
            <label className="block text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">
              Description
            </label>
            <input
              type="text"
              {...register('description')}
              className="w-full bg-white border border-orange-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
            />
          </div>

          {/* Priority & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-5 hover:bg-amber-100 hover:border-l-amber-600">
              <label className="block text-xs font-mono text-amber-600 uppercase tracking-widest mb-2">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full bg-white border border-amber-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              >
                <option value=""></option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 p-5 hover:bg-emerald-100 hover:border-l-emerald-600">
              <label className="block text-xs font-mono text-emerald-600 uppercase tracking-widest mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-white border border-emerald-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
              >
                <option value=""></option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

          </div>

          {/* Start Date & Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-cyan-50 border border-cyan-200 border-l-4 border-l-cyan-500 p-5 hover:bg-cyan-100 hover:border-l-cyan-600">
              <label className="block text-xs font-mono text-cyan-600 uppercase tracking-widest mb-2">
                Start Date
              </label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full bg-white border border-cyan-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
              />
            </div>

            <div className="bg-violet-50 border border-violet-200 border-l-4 border-l-violet-500 p-5 hover:bg-violet-100 hover:border-l-violet-600">
              <label className="block text-xs font-mono text-violet-600 uppercase tracking-widest mb-2">
                Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full bg-white border border-violet-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
              />
            </div>

          </div>

          {/* Assign Developers */}
          {/* <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 p-5 hover:bg-rose-100 hover:border-l-rose-600">
            <label className="block text-xs font-mono text-rose-600 uppercase tracking-widest mb-3">
              Assign Developers
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
                    {...register('assigned')}
                    className="accent-rose-500"
                  />
                  <span className="font-mono text-sm text-slate-700">{dev.name}</span>
                </label>
              ))}
            </div>
          </div> */}

          {/* Document Upload */}
          <div className="bg-slate-50 border border-slate-200 border-l-4 border-l-slate-400 p-5 hover:bg-slate-100 hover:border-l-slate-500">
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">
              Document
            </label>
            <input
              type="file"
              {...register('document')}
              className="w-full font-mono text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:border file:border-slate-300 file:bg-white file:font-mono file:text-xs file:uppercase file:tracking-widest file:text-slate-600 hover:file:bg-slate-50"
            />
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
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-white text-slate-600 font-mono text-xs uppercase tracking-widest border border-slate-300 border-l-4 border-l-slate-400 hover:bg-slate-50 hover:text-slate-800 hover:border-l-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-amber-400 text-slate-900 font-mono text-xs uppercase tracking-widest font-bold border border-amber-300 border-l-4 border-l-amber-600 hover:bg-amber-500 hover:border-l-amber-700"
            >
              Update Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};