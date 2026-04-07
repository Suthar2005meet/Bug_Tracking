import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiAlertCircle, FiUploadCloud, FiCalendar, FiUser, FiType } from "react-icons/fi";

export const CreateBug = () => {
  const { userId } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getTaskDetails();
    getDevelopers();
    getProjectManagers();
  }, []);

  const getTaskDetails = async () => {
    const res = await axios.get(`/issue/details/${id}`);
    setTaskData(res.data.data);
  };

  const getDevelopers = async () => {
    const res = await axios.get("/user/developer");
    setDevelopers(res.data.data);
  };

  const getProjectManagers = async () => {
    const res = await axios.get("/user/projectmanager");
    setProjectManagers(res.data.data);
  };

  const onSubmit = async (data) => {
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
        alert("Bug Created Successfully");
        navigate(-1);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error creating bug");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-50 p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <FiAlertCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Report New Bug</h2>
          </div>
          {taskData && (
            <p className="text-slate-500 text-sm">
              Linked to Task: <span className="font-semibold text-slate-700">{taskData.title}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Bug Title</label>
            <input
              type="text"
              placeholder="e.g. Login button not responding on mobile"
              className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 focus:bg-white transition-all outline-none focus:ring-4 ${
                errors.title ? "border-rose-300 focus:ring-rose-50" : "border-slate-200 focus:ring-indigo-50 focus:border-indigo-400"
              }`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>}
          </div>

          {/* Description Textarea */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Detailed Description</label>
            <textarea
              rows="4"
              placeholder="Describe the steps to reproduce the bug..."
              className={`w-full px-4 py-2.5 rounded-lg border bg-slate-50 focus:bg-white transition-all outline-none focus:ring-4 ${
                errors.description ? "border-rose-300 focus:ring-rose-50" : "border-slate-200 focus:ring-indigo-50 focus:border-indigo-400"
              }`}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>}
          </div>

          {/* Dropdown Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Priority</label>
              <select 
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400"
                {...register("priority", { required: true })}
              >
                <option value="">Select Priority</option>
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Issue Type</label>
              <select 
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400"
                {...register("type", { required: true })}
              >
                <option value="">Select Type</option>
                <option value="UI Based">UI Based</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="API">API</option>
              </select>
            </div>
          </div>

          {/* Result & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Expected Result</label>
              <input
                type="text"
                placeholder="What should have happened?"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400"
                {...register("expectedResult", { required: true })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400"
                  {...register("dueDate", { required: true })}
                />
              </div>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Bug Screenshot (Optional)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUploadCloud className="w-8 h-8 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-400">PNG, JPG or GIF</p>
                </div>
                <input type="file" accept="image/*" className="hidden" {...register("image")} />
              </label>
            </div>
          </div>

          {/* Assignment Selection */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Assign To</label>
            <select 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400"
              {...register("assignedId", { required: true })}
            >
              <option value="">Select a user...</option>
              <optgroup label="Developers" className="font-bold text-indigo-600">
                {developers.map((u) => (
                  <option key={u._id} value={u._id} className="text-slate-700 font-normal">
                    👤 {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Project Managers" className="font-bold text-amber-600">
                {projectManagers.map((u) => (
                  <option key={u._id} value={u._id} className="text-slate-700 font-normal">
                    💼 {u.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              Create Bug Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};