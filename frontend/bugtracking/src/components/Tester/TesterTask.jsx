import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const TesterTask = () => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get(`/issue/tester/${userId}`);
      setIssues(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (issueId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`/issue/update/${issueId}`, { status: newStatus });
      getData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
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
      'In Testing': { bg: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.2)', dot: '#8b5cf6' },
      'Resolved': { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)', dot: '#10b981' },
      'Closed': { bg: 'rgba(255, 255, 255, 0.04)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.08)', dot: '#64748b' },
      'Re-Open': { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.2)', dot: '#f97316' },
    }
    return map[status] || { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)', dot: '#f59e0b' }
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
  }

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
            Tester Tasks
          </h1>
          <p className="text-slate-500 text-sm">Review and manage assigned testing tasks</p>
        </motion.div>

        {issues.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center glass rounded-2xl text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>🧪</div>
            <h3 className="text-lg font-bold text-white" style={{ marginBottom: '8px' }}>No tasks found</h3>
            <p className="text-slate-500 text-sm">No testing tasks assigned to you.</p>
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
                            Priority: <span style={{ color: issue.priority === 'High' ? '#f87171' : '#fbbf24' }}>{issue.priority}</span>
                          </span>
                          {issue.document && (
                            <a href={issue.document} target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: 600, color: '#22d3ee', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                              📎 Attachment
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="w-full sm:w-[220px] flex-shrink-0 flex flex-col justify-center gap-2.5 p-5 border-t sm:border-t-0 sm:border-l border-white/[0.04]">

                      {issue.status === "In Testing" && (
                        <>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              style={{
                                ...btnBaseStyle, flex: 1,
                                background: 'linear-gradient(135deg, #047857, #10b981)',
                                color: '#fff', border: '1px solid rgba(16, 185, 129, 0.3)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                                opacity: loading ? 0.5 : 1,
                              }}
                              onClick={() => updateStatus(issue._id, "Resolved")}
                              disabled={loading}
                            >
                              Resolve
                            </button>
                            <button
                              style={{
                                ...btnBaseStyle, flex: 1,
                                background: 'linear-gradient(135deg, #be123c, #ef4444)',
                                color: '#fff', border: '1px solid rgba(239, 68, 68, 0.3)',
                                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)',
                                opacity: loading ? 0.5 : 1,
                              }}
                              onClick={() => updateStatus(issue._id, "Closed")}
                              disabled={loading}
                            >
                              Close
                            </button>
                          </div>
                          <button
                            style={{
                              ...btnBaseStyle, width: '100%',
                              background: 'linear-gradient(90deg, rgba(20, 83, 78, 0.8), rgba(20, 184, 166, 0.5))',
                              color: '#fff', border: '1px solid rgba(20, 184, 166, 0.3)',
                              boxShadow: '0 0 20px rgba(20, 184, 166, 0.12)',
                            }}
                            onClick={() => navigate(`createbug/${issue._id}`)}
                          >
                            🐛 Report Bug
                          </button>
                        </>
                      )}

                      {issue.status === "Resolved" && (
                        <button
                          style={{
                            ...btnBaseStyle, width: '100%',
                            background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
                            color: '#fff', border: '1px solid rgba(124, 58, 237, 0.3)',
                            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.25)',
                            opacity: loading ? 0.5 : 1,
                          }}
                          onClick={() => updateStatus(issue._id, "Re-Open")}
                          disabled={loading}
                        >
                          🔄 Re-Open
                        </button>
                      )}

                      {issue.status === "Closed" && (
                        <div style={{
                          textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#94a3b8', background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}>
                          🔒 Closed
                        </div>
                      )}

                      {issue.status === "Re-Open" && (
                        <div style={{
                          textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: '#fb923c', background: 'rgba(249, 115, 22, 0.1)', padding: '10px', borderRadius: '10px',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                        }}>
                          🔄 Waiting for Developer
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