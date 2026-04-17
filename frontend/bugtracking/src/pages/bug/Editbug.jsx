import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AuthContext } from "../../AuthProvider";

export const Editbug = () => {
  const {userId} = useContext(AuthContext)
  const user = userId;
  const navigate = useNavigate();
  const { id } = useParams();

  const [projects, setProjects] = useState([]);
  const [reported, setReported] = useState([]);
  const [developer, setDeveloper] = useState([]);
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const getData = async () => {
    try {
      const res = await axios.get(`/bug/bug/${id}`);
      setBug(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch bug data");
    }
  };

  const submitHandle = async (data) => {
    setLoading(true);
    try {
      const res = await axios.put(`/bug/update/${id}`, data);
      if (res.status == 200) {
        toast.success("Bug Updated Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await axios.get("/project/all");
      setProjects(res.data.data);
    } catch (err) { console.log(err); }
  };

  const fetchAllReported = async () => {
    try {
      const report = await axios.get("/user/tester");
      setReported(report.data.data);
    } catch (err) { console.log(err); }
  };

  const fetchAllDeveloper = async () => {
    try {
      const res = await axios.get("/user/developer");
      setDeveloper(res.data.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    getData();
    fetchAllProjects();
    fetchAllReported();
    fetchAllDeveloper();
  }, [id]);

  useEffect(() => {
    if (!bug) return;
    reset({
      title: bug.title || "",
      description: bug.description || "",
      projectName: bug.projectName?._id || bug.projectName || "",
      type: bug.type || "",
      priority: bug.priority || "",
      status: bug.status || "open",
    });
    const assignedIds = Array.isArray(bug.assigned)
      ? bug.assigned.map((a) => (typeof a === "object" ? a._id : a))
      : [];
    setValue("assigned", assignedIds);
  }, [bug, reset, setValue]);

  if (!bug) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

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
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.25em] mb-1">Bug Tracker</p>
          <h2 className="text-xl font-extrabold text-white">Edit Bug</h2>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-6">
          {/* Title */}
          <div className="glass p-5 border-l-[3px] border-l-cyan-500/50">
            <label className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2">Bug Title</label>
            <input type="text" {...register("title", { required: true })} className="input-dark" />
          </div>

          {/* Description */}
          <div className="glass p-5 border-l-[3px] border-l-amber-500/50">
            <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Description</label>
            <textarea rows={3} {...register("description", { required: true })} className="input-dark resize-none" />
          </div>

          <input type="hidden" {...register('updatedBy')} value={userId} />

          {/* Project */}
          <div className="glass p-5 border-l-[3px] border-l-violet-500/50">
            <label className="block text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">Project</label>
            <select {...register("projectName")} className="input-dark">
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>{project.projectName}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="glass p-5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Component</label>
            <select {...register("type", { required: true })} className="input-dark">
              <option value="">Select component</option>
              <option value="UI Based">UI Based</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="API">API</option>
            </select>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">Priority</label>
              <select {...register("priority", { required: true })} className="input-dark">
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="glass p-5">
              <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Status</label>
              <select {...register("status")} className="input-dark">
                <option value="open">Open</option>
                <option value="In progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Assign Developers */}
          <div className="glass p-5">
            <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3">Assign Developers</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {developer.map((dev) => (
                <label key={dev._id} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-3 py-2 rounded-lg cursor-pointer hover:bg-white/[0.06] hover:border-rose-500/20 transition-all">
                  <input type="checkbox" value={dev._id} {...register("assigned")} className="accent-rose-500" />
                  <span className="text-sm text-slate-400">{dev.name}</span>
                </label>
              ))}
            </div>
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
              {loading ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : 'Update Bug'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};