import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { hasRole } from "../../utils/roles";
import { motion } from "framer-motion";

export const Bug = () => {
  const { userId, role } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [bugList, setBugList] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const isDeveloper = hasRole(role, "Developer");
  const isTester = hasRole(role, "Tester");

  const fetchUserBugs = async () => {
    try {
      const response = await axios.get(`/bug/user/${userId}`);
      setBugList(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch bugs:", error);
      setBugList([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBugStatus = async (bugId, newStatus) => {
    setActionLoading(`${bugId}-${newStatus}`);
    try {
      await axios.put(`/bug/status/${bugId}`, { status: newStatus, updatedBy: userId });
      fetchUserBugs();
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (userId) fetchUserBugs();
  }, [userId]);

  const avatarGradients = [
    { from: '#f59e0b', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#10b981', to: '#14b8a6' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#8b5cf6', to: '#6366f1' },
    { from: '#f97316', to: '#ef4444' },
  ]

  const getInitial = (title) => (title || 'B').charAt(0).toUpperCase()

  const getStatusStyle = (status) => {
    const map = {
      'Open': { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)', dot: '#f59e0b' },
      'In Progress': { bg: 'rgba(6, 182, 212, 0.1)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.2)', dot: '#06b6d4' },
      'In Testing': { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.2)', dot: '#8b5cf6' },
      'Resolved': { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)', dot: '#10b981' },
      'Re-Open': { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.2)', dot: '#f97316' },
      'Closed': { bg: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.08)', dot: '#64748b' },
    }
    return map[status] || map['Open']
  }

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

  const btnEditStyle = {
    background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
    border: '1px solid rgba(124, 58, 237, 0.3)',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-10 h-10 border-3 border-white/10 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
            My Bugs
          </h1>
          <p className="text-slate-500 text-sm">Track and manage bugs assigned to you</p>
        </motion.div>

        {/* Empty */}
        {bugList.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center glass rounded-2xl text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🐛</div>
            <h3 className="text-lg font-bold text-white" style={{ marginBottom: '8px' }}>No bugs found</h3>
            <p className="text-slate-500 text-sm">No bugs assigned to you</p>
          </motion.div>
        )}

        {/* Bug Cards */}
        {bugList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bugList.map((bug, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = getInitial(bug.title)
              const ss = getStatusStyle(bug.status)

              return (
                <motion.div
                  key={bug._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <div
                    className="group flex flex-col sm:flex-row items-stretch overflow-hidden"
                    style={cardStyle}
                    {...cardHoverHandlers}
                  >
                    {/* LEFT: Avatar + Info */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-start sm:items-center p-6 gap-5">
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

                      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <h2 className="group-hover:text-cyan-400 transition-colors" style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bug.title}
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          {/* Status Badge */}
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '6px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                            background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ss.dot, boxShadow: `0 0 8px ${ss.dot}cc` }} />
                            {bug.status}
                          </span>
                          {/* Description */}
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                            {bug.description}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="w-full sm:w-[220px] flex-shrink-0 flex flex-col justify-center gap-2.5 p-5 border-t sm:border-t-0 sm:border-l border-white/[0.04]">
                      {/* View Details */}
                      <Link
                        to={`details/${bug._id}`}
                        style={{ ...btnDetailsStyle, ...btnBaseStyle, display: 'block' }}
                      >
                        View Details
                      </Link>

                      {/* Developer: Start Working */}
                      {isDeveloper && (bug.status === "Open" || bug.status === "Re-Open") && (
                        <button
                          onClick={() => updateBugStatus(bug._id, "In Progress")}
                          disabled={actionLoading === `${bug._id}-In Progress`}
                          style={{
                            ...btnBaseStyle, width: '100%',
                            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            color: '#fff', border: '1px solid rgba(59, 130, 246, 0.3)',
                            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
                            opacity: actionLoading === `${bug._id}-In Progress` ? 0.6 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          }}
                        >
                          {actionLoading === `${bug._id}-In Progress` ? (<><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />Processing...</>) : (bug.status === "Open" ? "▶ Start Working" : "🔄 Restart Working")}
                        </button>
                      )}

                      {/* Developer: Send to Testing */}
                      {isDeveloper && bug.status === "In Progress" && (
                        <button
                          onClick={() => updateBugStatus(bug._id, "In Testing")}
                          disabled={actionLoading === `${bug._id}-In Testing`}
                          style={{
                            ...btnBaseStyle, width: '100%',
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            color: '#fff', border: '1px solid rgba(124, 58, 237, 0.3)',
                            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                            opacity: actionLoading === `${bug._id}-In Testing` ? 0.6 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          }}
                        >
                          {actionLoading === `${bug._id}-In Testing` ? (<><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />Processing...</>) : '🧪 Ready for Testing'}
                        </button>
                      )}

                      {/* Developer: View Only Badges */}
                      {isDeveloper && ["In Testing", "Resolved", "Closed"].includes(bug.status) && (
                        <div style={{
                          textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#64748b', background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}>
                          {bug.status === "In Testing" ? "🔒 Waiting for Tester" : 
                           bug.status === "Resolved" ? "✅ Resolved" : "🔒 Closed"}
                        </div>
                      )}

                      {/* Tester: Verify -> Resolve or Re-Open */}
                      {isTester && bug.status === "In Testing" && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => updateBugStatus(bug._id, "Resolved")}
                            disabled={!!actionLoading}
                            style={{
                              ...btnBaseStyle,
                              background: 'linear-gradient(135deg, #047857, #10b981)',
                              color: '#fff', border: '1px solid rgba(16, 185, 129, 0.3)',
                              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                              opacity: actionLoading === `${bug._id}-Resolved` ? 0.6 : 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                            }}
                          >
                            {actionLoading === `${bug._id}-Resolved` ? (<><div style={{width:'12px',height:'12px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />...</>) : '✅ Resolve'}
                          </button>
                          <button
                            onClick={() => updateBugStatus(bug._id, "Re-Open")}
                            disabled={!!actionLoading}
                            style={{
                              ...btnBaseStyle,
                              background: 'rgba(255,255,255,0.04)',
                              color: '#fb923c', border: '1px solid rgba(255,255,255,0.08)',
                              opacity: actionLoading === `${bug._id}-Re-Open` ? 0.6 : 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                            }}
                          >
                            {actionLoading === `${bug._id}-Re-Open` ? (<><div style={{width:'12px',height:'12px',border:'2px solid rgba(249,115,22,0.3)',borderTop:'2px solid #fb923c',borderRadius:'50%',animation:'spin 1s linear infinite'}} />...</>) : '🔄 Re-Open'}
                          </button>
                        </div>
                      )}

                      {/* Tester: Close Resolved Bug */}
                      {isTester && bug.status === "Resolved" && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => updateBugStatus(bug._id, "Closed")}
                            disabled={!!actionLoading}
                            style={{
                              ...btnBaseStyle,
                              background: 'linear-gradient(135deg, #be123c, #ef4444)',
                              color: '#fff', border: '1px solid rgba(239, 68, 68, 0.3)',
                              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
                              opacity: actionLoading === `${bug._id}-Closed` ? 0.6 : 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                            }}
                          >
                            {actionLoading === `${bug._id}-Closed` ? (<><div style={{width:'12px',height:'12px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />...</>) : '🔒 Close Bug'}
                          </button>
                          <button
                            onClick={() => updateBugStatus(bug._id, "Re-Open")}
                            disabled={!!actionLoading}
                            style={{
                              ...btnBaseStyle,
                              background: 'rgba(255,255,255,0.04)',
                              color: '#fb923c', border: '1px solid rgba(255,255,255,0.08)',
                              opacity: actionLoading === `${bug._id}-Re-Open` ? 0.6 : 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                            }}
                          >
                            {actionLoading === `${bug._id}-Re-Open` ? (<><div style={{width:'12px',height:'12px',border:'2px solid rgba(249,115,22,0.3)',borderTop:'2px solid #fb923c',borderRadius:'50%',animation:'spin 1s linear infinite'}} />...</>) : '🔄 Re-Open'}
                          </button>
                        </div>
                      )}

                      {/* Comment + History */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!( (isDeveloper || isTester) && bug.status === "Closed") && (
                          <Link
                            to={`addcomment/${bug._id}`}
                            style={{ ...btnSprintStyle, ...btnBaseStyle, display: 'block', fontSize: '10px' }}
                          >
                            + Comment
                          </Link>
                        )}
                        <Link
                          to={`allcomment/${bug._id}`}
                          style={{
                            ...btnBaseStyle,
                            background: 'rgba(255,255,255,0.04)',
                            color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)',
                            display: 'block', fontSize: '10px',
                          }}
                        >
                          History
                        </Link>
                      </div>
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
