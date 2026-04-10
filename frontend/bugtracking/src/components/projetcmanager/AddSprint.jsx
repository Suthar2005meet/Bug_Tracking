import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { useToast } from "../../hooks/useToast";

export const AddSprint = () => {
  const { id } = useParams(); // projectId from URL
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    userId : "",
    projectId: id,
    startDate: "",
    dueDate: "",
    status: "Planned",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Date validation
    if (new Date(formData.dueDate) < new Date(formData.startDate)) {
      toast.error("Due date cannot be before start date");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/sprint/add", {
        ...formData,
        userId: userId, // ✅ important for activity & notification
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

  const inputClass =
    "w-full px-4 py-2.5 text-sm text-slate-800 bg-white rounded-xl border border-slate-200 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-300 shadow-sm";

  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

  const statusColors = {
    Planned: "text-blue-700 bg-blue-50",
    Active: "text-emerald-700 bg-emerald-50",
    Completed: "text-slate-600 bg-slate-100",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 to-blue-900 px-8 pt-8 pb-10">
          <div className="relative flex items-center gap-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 text-2xl">
              🚀
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                New Sprint
              </h2>
              <p className="text-blue-300 text-xs">
                Configure and launch your sprint
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">

          {/* Sprint Name */}
          <div>
            <label className={labelClass}>Sprint Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g., Sprint 1 — Auth Module"
              className={inputClass}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                className={inputClass}
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                required
                className={inputClass}
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Initial Status</label>
            <select
              name="status"
              className={`${inputClass} font-semibold ${
                statusColors[formData.status] || ""
              }`}
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Planned">🗓️ Planned</option>
              <option value="Active">⚡ Active</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] px-4 py-3 text-sm font-bold rounded-xl text-white transition-all
                ${
                  loading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Creating..." : "🚀 Save Sprint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};