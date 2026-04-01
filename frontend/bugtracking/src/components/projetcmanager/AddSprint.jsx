import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export const AddSprint = () => {
  // Extracting 'id' from: /projects/sprint/:id/addsprint
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    projectId: id, // Mapping the URL ID to the schema's projectId
    startDate: "",
    dueDate: "",
    status: "Planned", 
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure this matches your back-end route for creating sprints
      await axios.post("/sprint/add", formData);
      
      // Navigate back to the Sprint List for this specific project
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Decorative Header */}
        <div className="bg-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white text-center">New Project Sprint</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Sprint Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Sprint Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter sprint name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status Enum Dropdown */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Initial Status</label>
            <div className="relative">
              <select
                name="status"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Save Sprint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};