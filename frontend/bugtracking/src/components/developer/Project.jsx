import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

export const Project = () => {
  const { userId } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch projects by user
  const getProjectsByUser = async () => {
    try {
      const res = await axios.get(`/project/user/${userId}`);
      setProjects(res.data.data || []);
    } catch (error) {
      console.log("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Start Testing (PUT API)
  const handleStartTesting = async (projectId) => {
    try {
      await axios.put(`/project/testing/${projectId}`);

      // Update local state after success
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, inTesting: true, status: "Testing" }
            : project
        )
      );
    } catch (error) {
      console.log("Error updating project:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getProjectsByUser();
  }, [userId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        My Assigned Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-slate-500">No Projects Assigned</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-5"
          >
            {/* Project Info */}
            <h3 className="text-lg font-semibold text-slate-800">
              {project.title}
            </h3>

            <p className="text-sm text-slate-600 mt-2">
              {project.description}
            </p>

            <div className="flex gap-4 mt-3 text-sm">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                {project.priority}
              </span>

              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {project.status}
              </span>
            </div>

            <div className="text-sm text-slate-500 mt-3">
              <p>Start Date: {project.startDate}</p>
              <p>Due Date: {project.dueDate}</p>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-3">
              <Link
                to={`/project/details/${project._id}`}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Details
              </Link>

              <button
                onClick={() => handleStartTesting(project._id)}
                disabled={project.inTesting}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  project.inTesting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {project.inTesting ? "In Testing" : "Go To Testing"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};