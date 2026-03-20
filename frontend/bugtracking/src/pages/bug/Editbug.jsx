import axios from "axios";
import { input, option } from "framer-motion/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const Editbug = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [reported, setReported] = useState([]);
  const [developer, setdeveloper] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [bug, setBug] = useState(null);

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
      toast.error("Failed to fetch projects");
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
      console.log(res.data.data);
      setdeveloper(res.data.data);
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
    if (bug) reset(bug);
  }, [bug, reset]);

  if (!bug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-blue-600 px-8 py-5">
          <h2 className="text-white text-lg font-semibold">Edit Bug</h2>
          <p className="text-blue-200 text-xs mt-0.5">
            Update the details below and save changes
          </p>
        </div>

        <form
          onSubmit={handleSubmit(submitHandle)}
          className="px-8 py-6 space-y-5"
        >
          {/* Bug Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bug Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter bug title"
              {...register("title", { required: true })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Describe the bug..."
              {...register("description", { required: true })}
            />
          </div>

          {/* Project + Developer — 2 col */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                {...register("projectName")}
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
            {developer.map((dev) => (
              <label
                key={dev._id}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={dev._id} // store ID in database
                  {...register("assignedMembers", { required: true })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />

                <span>{dev.name}</span>
              </label>
            ))}
          </div>

          {/* Component + Priority — 2 col */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Component
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                {...register("type", { required: true })}
              >
                <option value="">Select component</option>
                <option value="UI Based">UI Based</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="API">API</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                {...register("priority", { required: true })}
              >
                <option value=""></option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Status + Assigned To — 2 col */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                {...register("status")}
              >
                <option value="open">Open</option>
                <option value="In progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Assignee name"
                {...register("assignedTo")}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/bug")}
              className="px-5 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Update Bug
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
