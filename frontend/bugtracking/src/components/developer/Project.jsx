import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { motion } from "framer-motion";

export const Project = () => {
  const { userId } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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

  const handleStartTesting = async (projectId) => {
    setActionLoading(projectId);
    try {
      await axios.put(`/project/testing/${projectId}`);
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? { ...project, inTesting: true, status: "Testing" } : project
        )
      );
    } catch (error) {
      console.log("Error updating project:", error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getProjectsByUser();
  }, [userId]);

  const avatarGradients = [
    { from: '#f59e0b', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#10b981', to: '#14b8a6' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#8b5cf6', to: '#6366f1' },
    { from: '#f97316', to: '#ef4444' },
  ]

  const getInitial = (title) => (title || 'P').charAt(0).toUpperCase()

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(12, 18, 36, 0.92) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
  }

  const cardHoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
      e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    },
  }

  const btnDetailsStyle = {
    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  }

  const btnSprintStyle = {
    background: 'linear-gradient(90deg, rgba(20, 83, 78, 0.8), rgba(20, 184, 166, 0.5))',
    color: '#fff',
    border: '1px solid rgba(20, 184, 166, 0.3)',
    boxShadow: '0 0 20px rgba(20, 184, 166, 0.12)',
  }

  const btnBaseStyle = {
    flex: 1,
    textAlign: 'center',
    padding: '8px 0',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    textDecoration: 'none',
    transition: 'all 0.2s',
    cursor: 'pointer',
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-3 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />
      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
            My Assigned Projects
          </h1>
          <p className="text-slate-500 text-sm">View and manage your assigned development projects</p>
        </motion.div>

        {/* Empty */}
        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center glass rounded-2xl text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📁</div>
            <h3 className="text-lg font-bold text-white" style={{ marginBottom: '8px' }}>No projects found</h3>
            <p className="text-slate-500 text-sm">You haven't been assigned to any projects yet.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {projects.map((project, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = getInitial(project.title)

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <div
                    className="group"
                    style={{ ...cardStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}
                    {...cardHoverHandlers}
                  >
                    {/* LEFT: Avatar + Info */}
                    <div style={{ flex: '1 1 0', minWidth: '0', display: 'flex', alignItems: 'center', gap: '20px', padding: '24px 28px' }}>
                      {/* Letter Avatar */}
                      <div
                        style={{
                          flexShrink: 0, width: '56px', height: '56px', borderRadius: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '24px', fontWeight: 800,
                          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                          boxShadow: `0 8px 24px ${gradient.from}33`, transition: 'transform 0.3s',
                        }}
                        className="group-hover:scale-105"
                      >
                        {initial}
                      </div>

                      {/* Text Content */}
                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <h2 className="group-hover:text-cyan-400 transition-colors" style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.title}
                        </h2>

                        {/* Status + Description */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '6px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                            background: project.status === 'Testing' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: project.status === 'Testing' ? '#fbbf24' : '#34d399',
                            border: `1px solid ${project.status === 'Testing' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: project.status === 'Testing' ? '#f59e0b' : '#10b981', boxShadow: `0 0 8px ${project.status === 'Testing' ? 'rgba(245,158,11,0.8)' : 'rgba(16,185,129,0.8)'}` }} />
                            {project.status || 'Active'}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                            {project.description}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '20px 24px', borderLeft: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <Link
                        to={`/project/details/${project._id}`}
                        style={{ ...btnDetailsStyle, ...btnBaseStyle }}
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => handleStartTesting(project._id)}
                        disabled={project.inTesting || actionLoading === project._id}
                        style={{
                          ...btnBaseStyle,
                          ...(project.inTesting
                            ? { background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed', opacity: 0.5 }
                            : actionLoading === project._id
                              ? { ...btnSprintStyle, opacity: 0.6, cursor: 'not-allowed' }
                              : btnSprintStyle),
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        }}
                      >
                        {project.inTesting ? '✓ In Testing' : actionLoading === project._id ? (<><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />Processing...</>) : '🚀 Go To Testing'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};