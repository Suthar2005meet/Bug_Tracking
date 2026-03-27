import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

export const Project = () => {
  const { userId } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    getProjectsByUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Assigned Projects</h2>

      {projects.length === 0 ? (
        <p>No Projects Assigned</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <div>
              <h3>{project.projectName}</h3>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Priority:</strong> {project.priority}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <p><strong>Start Date:</strong> {project.startDate}</p>
              <p><strong>Due Date:</strong> {project.dueDate}</p>
            </div>

            <div style={{ marginTop: "10px" }}>
              <Link
                to={`/project/details/${project._id}`}
                style={{
                  marginRight: "10px",
                  textDecoration: "none",
                  color: "blue",
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};