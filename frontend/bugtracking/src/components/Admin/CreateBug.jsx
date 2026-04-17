import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiAlertCircle,
  FiUploadCloud,
} from "react-icons/fi";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";

export const CreateBug = () => {
  const { userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [taskData, setTaskData] = useState(null);
  const [user, setuser] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getTaskDetails();
    getUser()
  }, []);

  const getTaskDetails = async () => {
    const res = await axios.get(`/issue/details/${id}`);
    setTaskData(res.data.data);
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`/usermanage/pm-developer/${userId}`);
      const { projectManager, developers } = res.data.data;
      const combinedUsers = [];
      if (projectManager) combinedUsers.push(projectManager);
      if (developers && developers.length > 0) combinedUsers.push(...developers);
      setuser(combinedUsers);
    } catch (err) {
      console.log(err);
      setuser([]);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("priority", data.priority);
      formData.append("type", data.type);
      formData.append("expectedResult", data.expectedResult);
      formData.append("dueDate", data.dueDate);
      formData.append("taskId", id);
      formData.append("reportedBy", userId);
      formData.append("assignedId", data.assignedId);

      if (data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axios.post("/bug/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Bug Created Successfully");
        navigate(-1);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Error creating bug");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className="glass overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border-b border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-red-500/15 text-red-400 rounded-xl">
                <FiAlertCircle size={22} />
              </div>
              <h2 className="text-xl font-extrabold text-white">Report New Bug</h2>
            </div>
            {taskData && (
              <p className="text-slate-500 text-sm">
                Linked to Task: <span className="font-semibold text-slate-300">{taskData.title}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bug Title</label>
              <input
                type="text"
                placeholder="e.g. Login button not responding on mobile"
                className={`input-dark ${errors.title ? 'border-red-500/50 focus:border-red-500' : ''}`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Detailed Description</label>
              <textarea
                rows="4"
                placeholder="Describe the steps to reproduce the bug..."
                className={`input-dark resize-none ${errors.description ? 'border-red-500/50' : ''}`}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
            </div>

            {/* Priority & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Priority</label>
                <select className="input-dark" {...register("priority", { required: true })}>
                  <option value="">Select Priority</option>
                  <option value="Low">🟢 Low</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="High">🔴 High</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Issue Type</label>
                <select className="input-dark" {...register("type", { required: true })}>
                  <option value="">Select Type</option>
                  <option value="UI Based">UI Based</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="API">API</option>
                </select>
              </div>
            </div>

            {/* Expected Result & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expected Result</label>
                <input type="text" placeholder="What should have happened?" className="input-dark" {...register("expectedResult", { required: true })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Due Date</label>
                <input type="date" className="input-dark" {...register("dueDate", { required: true })} />
              </div>
            </div>

            {/* Upload */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bug Screenshot (Optional)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/[0.06] border-dashed rounded-xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUploadCloud className="w-8 h-8 mb-3 text-slate-600" />
                  <p className="mb-2 text-sm text-slate-500"><span className="font-semibold text-slate-400">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-600">PNG, JPG or GIF</p>
                </div>
                <input type="file" accept="image/*" className="hidden" {...register("image")} />
              </label>
            </div>

            {/* Assign */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Assign To</label>
              <select className="input-dark" {...register("assignedId", { required: true })}>
                <option value="">Select a user...</option>
                {user.length > 0 && (
                  <optgroup label="Users">
                    {user.map((u) => (
                      <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04]">
              <button type="button" onClick={() => navigate(-1)} className="btn-ghost text-sm">Cancel</button>
              <button type="submit" disabled={submitting} className={`btn-primary text-sm flex items-center justify-center gap-2 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {submitting ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</>) : 'Create Bug Report'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
