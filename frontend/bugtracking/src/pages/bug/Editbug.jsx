import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const Editbug = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [projects, setProjects] = useState([]);
  const [reported, setReported] = useState([]);
  const [developer, setDeveloper] = useState([]);
  const [bug, setBug] = useState(null);

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
    try {
      const res = await axios.put(`/bug/update/${id}`, data);
      if (res.status === 200) {
        toast.success("Bug Updated Successfully!");
        navigate("/admin/bug");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await axios.get("/project/all");
      setProjects(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllReported = async () => {
    try {
      const report = await axios.get("/user/tester");
      setReported(report.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllDeveloper = async () => {
    try {
      const res = await axios.get("/user/developer");
      setDeveloper(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    fetchAllProjects();
    fetchAllReported();
    fetchAllDeveloper();
  }, [id]);

  useEffect(() => {
    if (!bug) return;

    // Reset all simple fields
    reset({
      title: bug.title || "",
      description: bug.description || "",
      projectName: bug.projectName?._id || bug.projectName || "",
      type: bug.type || "",
      priority: bug.priority || "",
      status: bug.status || "open",
    });

    // Fix checkbox pre-fill: backend may return array of objects or array of IDs
    // Normalize to array of plain string IDs
    const assignedIds = Array.isArray(bug.assigned)
      ? bug.assigned.map((a) => (typeof a === "object" ? a._id : a))
      : [];

    setValue("assigned", assignedIds);
  }, [bug, reset, setValue]);

  if (!bug) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 bg-white border-l-4 border-amber-400 pl-5 pr-4 py-4 shadow-sm">
          <p className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">
            Bug Tracker
          </p>
          <h2 className="text-2xl font-mono font-bold text-slate-800">Edit Bug</h2>
        </div>

        <form onSubmit={handleSubmit(submitHandle)} className="space-y-4">

          {/* Bug Title */}
          <div className="bg-sky-50 border border-sky-200 border-l-4 border-l-sky-500 p-5 hover:bg-sky-100 hover:border-l-sky-600">
            <label className="block text-xs font-mono text-sky-600 uppercase tracking-widest mb-2">
              Bug Title
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full bg-white border border-sky-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
            />
          </div>

          {/* Description */}
          <div className="bg-orange-50 border border-orange-200 border-l-4 border-l-orange-500 p-5 hover:bg-orange-100 hover:border-l-orange-600">
            <label className="block text-xs font-mono text-orange-600 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description", { required: true })}
              className="w-full bg-white border border-orange-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-200 resize-none"
            />
          </div>

          {/* Project */}
          <div className="bg-cyan-50 border border-cyan-200 border-l-4 border-l-cyan-500 p-5 hover:bg-cyan-100 hover:border-l-cyan-600">
            <label className="block text-xs font-mono text-cyan-600 uppercase tracking-widest mb-2">
              Project
            </label>
            <select
              {...register("projectName")}
              className="w-full bg-white border border-cyan-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Component / Type */}
          <div className="bg-violet-50 border border-violet-200 border-l-4 border-l-violet-500 p-5 hover:bg-violet-100 hover:border-l-violet-600">
            <label className="block text-xs font-mono text-violet-600 uppercase tracking-widest mb-2">
              Component
            </label>
            <select
              {...register("type", { required: true })}
              className="w-full bg-white border border-violet-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
            >
              <option value="">Select component</option>
              <option value="UI Based">UI Based</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="API">API</option>
            </select>
          </div>

          {/* Priority & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-5 hover:bg-amber-100 hover:border-l-amber-600">
              <label className="block text-xs font-mono text-amber-600 uppercase tracking-widest mb-2">
                Priority
              </label>
              <select
                {...register("priority", { required: true })}
                className="w-full bg-white border border-amber-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              >
                <option value="">Select priority</option>
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
                {...register("status")}
                className="w-full bg-white border border-emerald-200 px-3 py-2 font-mono text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
              >
                <option value="open">Open</option>
                <option value="In progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

          </div>

          {/* Assign Developers — single list, pre-checked from bug.assigned */}
          <div className="bg-rose-50 border border-rose-200 border-l-4 border-l-rose-500 p-5 hover:bg-rose-100 hover:border-l-rose-600">
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
                    {...register("assigned")}
                    className="accent-rose-500"
                  />
                  <span className="font-mono text-sm text-slate-700">{dev.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Actions
            </span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/bug")}
              className="flex-1 py-3 bg-white text-slate-600 font-mono text-xs uppercase tracking-widest border border-slate-300 border-l-4 border-l-slate-400 hover:bg-slate-50 hover:text-slate-800 hover:border-l-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-amber-400 text-slate-900 font-mono text-xs uppercase tracking-widest font-bold border border-amber-300 border-l-4 border-l-amber-600 hover:bg-amber-500 hover:border-l-amber-700"
            >
              Update Bug
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};