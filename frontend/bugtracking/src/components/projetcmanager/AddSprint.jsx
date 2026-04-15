import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";

export const AddSprint = () => {
  const { id } = useParams();
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    userId: "",
    projectId: id,
    startDate: "",
    dueDate: "",
    status: "Planned",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.dueDate) < new Date(formData.startDate)) {
      toast.error("Due date cannot be before start date");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/sprint/add", {
        ...formData,
        userId: userId,
      });
      navigate(-1);
    } catch (err) {
      console.error("Error adding sprint:", err.response?.data || err);
      toast.error("Failed to add sprint.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center relative w-full py-8">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-b border-white/[0.06] px-8 pt-8 pb-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              🚀
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-wide">
                New Sprint
              </h2>
              <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest mt-1">
                Configure and launch your sprint
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-5">
          {/* Sprint Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Sprint Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g., Sprint 1 - Auth Module"
              className="input-dark w-full text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                className="input-dark w-full text-sm"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                required
                className="input-dark w-full text-sm"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 pl-1">Initial Status</label>
            <select
              name="status"
              className="input-dark w-full text-sm font-semibold"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Planned">🗓️ Planned</option>
              <option value="Active">⚡ Active</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/[0.04] px-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-all rounded-full border border-white/[0.06]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3 text-[11px] font-bold uppercase tracking-widest text-white rounded-full transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 flex justify-center items-center gap-2 border-0 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : "🚀 Save Sprint"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};