import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";

export const Task = () => {
  const { userId } = useContext(AuthContext);
  const toast = useToast();

  const [issues, setIssues] = useState([]);
  const [user, setuser] = useState([])
  const [selectedTester, setSelectedTester] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const getIssues = async () => {
    try {
      const res = await axios.get(`/issue/user/${userId}`);
      setIssues(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getUser = async () => {
    try {
      const res = await axios.get("/usermanage/tester");
      setuser(res.data.team.users || []);
    } catch (err) {
      console.log(err);
      setuser([]);
    }
  };

  const startProgress = async (issueId) => {
    try {
      setActionLoading(`${issueId}-start`);
      await axios.put(`/issue/update/${issueId}`, { status: "In Progress" });
      getIssues();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(null);
    }
  };

  const addTester = async (issueId) => {
    try {
      if (!selectedTester[issueId]) {
        toast.warning("Please select tester");
        return;
      }
      setActionLoading(`${issueId}-test`);
      await axios.put(`/issue/adduser/${issueId}`, { assigned: selectedTester[issueId] });
      await axios.put(`/issue/update/${issueId}`, { status: "In Testing" });
      getIssues();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    getIssues();
    getUser()
  }, []);

  const avatarGradients = [
    { from: '#f59e0b', to: '#8b5cf6' },
    { from: '#06b6d4', to: '#3b82f6' },
    { from: '#10b981', to: '#14b8a6' },
    { from: '#ec4899', to: '#f43f5e' },
    { from: '#8b5cf6', to: '#6366f1' },
    { from: '#f97316', to: '#ef4444' },
  ]

  const getInitial = (title) => (title || 'T').charAt(0).toUpperCase()

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

  const btnBaseStyle = {
    textAlign: 'center',
    padding: '8px 0',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.2s',
    cursor: 'pointer',
    width: '100%',
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
            My Tasks
          </h1>
          <p className="text-slate-500 text-sm">Track and manage your assigned tasks</p>
        </motion.div>

        {issues.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center glass rounded-2xl text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📋</div>
            <h3 className="text-lg font-bold text-white" style={{ marginBottom: '8px' }}>No tasks assigned</h3>
            <p className="text-slate-500 text-sm">No tasks assigned to you right now.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {issues.map((issue, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = getInitial(issue.title)
              const ss = getStatusStyle(issue.status)

              return (
                <motion.div
                  key={issue._id}
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
                          {issue.title}
                        </h2>

                        {/* Status + Type */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', borderRadius: '6px',
                            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                            background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ss.dot, boxShadow: `0 0 8px ${ss.dot}cc` }} />
                            {issue.status}
                          </span>
                          <span style={{ display: 'inline-flex', padding: '2px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {issue.issueType}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                            Priority: <span style={{ color: issue.priority === 'High' ? '#f87171' : issue.priority === 'Medium' ? '#fbbf24' : '#34d399' }}>{issue.priority}</span>
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>
                            Project: <span style={{ color: '#94a3b8' }}>{issue.projectId?.title}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="w-full sm:w-[220px] flex-shrink-0 flex flex-col justify-center gap-2.5 p-5 border-t sm:border-t-0 sm:border-l border-white/[0.04]">

                      {(issue.status === "Open" || issue.status === "Re-Open") && (
                        <button
                          style={{
                            ...btnBaseStyle,
                            background: 'linear-gradient(90deg, rgba(20, 83, 78, 0.8), rgba(20, 184, 166, 0.5))',
                            color: '#fff', border: '1px solid rgba(20, 184, 166, 0.3)',
                            boxShadow: '0 0 20px rgba(20, 184, 166, 0.12)',
                            opacity: actionLoading === `${issue._id}-start` ? 0.6 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          }}
                          onClick={() => startProgress(issue._id)}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === `${issue._id}-start` ? (<><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />Processing...</>) : (issue.status === "Open" ? "▶ Start" : "🔄 Restart")}
                        </button>
                      )}

                      {issue.status === "In Progress" && (
                        <>
                          <select
                            style={{
                              ...btnBaseStyle,
                              background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                              border: '1px solid rgba(255,255,255,0.08)', padding: '8px 12px',
                              fontSize: '10px', appearance: 'none',
                            }}
                            value={selectedTester[issue._id] || ""}
                            onChange={(e) => setSelectedTester({ ...selectedTester, [issue._id]: e.target.value })}
                          >
                            <option value="">Select Tester</option>
                            {user.map(u => (
                              <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                          </select>
                          <button
                            style={{
                              ...btnBaseStyle,
                              background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                              color: '#fff', border: '1px solid rgba(124, 58, 237, 0.3)',
                              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                              opacity: (!selectedTester[issue._id] || actionLoading === `${issue._id}-test`) ? 0.5 : 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}
                            onClick={() => addTester(issue._id)}
                            disabled={!selectedTester[issue._id] || !!actionLoading}
                          >
                            {actionLoading === `${issue._id}-test` ? (<><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite'}} />Processing...</>) : '🧪 To Test'}
                          </button>
                        </>
                      )}

                      {issue.status === "In Testing" && (
                        <div style={{
                          textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#a78bfa', background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '10px',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}>
                          🔒 Waiting for Tester
                        </div>
                      )}

                      {issue.status === "Resolved" && (
                        <div style={{
                          textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '10px',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}>
                          ✅ Done
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};