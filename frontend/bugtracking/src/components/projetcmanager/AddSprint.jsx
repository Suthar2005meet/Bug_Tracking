import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const AddSprint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    projectId: id,
    startDate: "",
    dueDate: "",
    status: "Planned",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/sprint/add", formData);
      navigate(`/projectmanager/projects/sprint/${id}`);
    } catch (err) {
      console.error("Error adding sprint:", err);
      alert("Failed to add sprint. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-slate-900 to-blue-900 px-8 pt-8 pb-10 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-blue-500/10 border border-blue-400/10" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-400/10" />

          <div className="relative flex items-center gap-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-2xl shadow-inner">
              🚀
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
                New Sprint
              </h2>
              <p className="text-blue-300 text-xs mt-0.5 font-medium">
                Configure and launch your sprint
              </p>
            </div>
          </div>
        </div>

        {/* ── Notch connector ── */}
        <div className="h-4 bg-gradient-to-r from-slate-900 to-blue-900 relative">
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-3xl" />
        </div>

        {/* ── Form ── */}
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
            <div className="relative">
              <select
                name="status"
                className={`${inputClass} appearance-none cursor-pointer pr-10 font-semibold ${statusColors[formData.status] || ""}`}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Planned">🗓️ Planned</option>
                <option value="Active">⚡ Active</option>
                <option value="Completed">✅ Completed</option>
              </select>
              {/* Custom chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 pt-1" />

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 active:scale-95 transition-all duration-150 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-[2] px-4 py-3 text-sm font-bold rounded-xl text-white transition-all duration-150 active:scale-95 shadow-lg
                ${loading
                  ? "bg-blue-300 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300 hover:shadow-xl"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Sprint...
                </span>
              ) : (
                "🚀 Save Sprint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};