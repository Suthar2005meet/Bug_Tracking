import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaBug } from "react-icons/fa";
import IssuesStatusChart from "../charts/IssuesStatusChart";
import IssuesPriorityChart from "../charts/IssuesPriorityChart";
import BugsStatusChart from "../charts/BugsStatusChart";
import { motion } from "framer-motion";

/* ── KPI Card ── */
const KpiCard = ({ icon, label, value, delay, color }) => {
  const colorMap = {
    blue: { gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', shadow: '0 8px 24px rgba(59,130,246,0.2)', iconBg: 'rgba(59,130,246,0.12)', iconColor: '#60a5fa', border: 'rgba(59,130,246,0.15)' },
    emerald: { gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', shadow: '0 8px 24px rgba(16,185,129,0.2)', iconBg: 'rgba(16,185,129,0.12)', iconColor: '#34d399', border: 'rgba(16,185,129,0.15)' },
    amber: { gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', shadow: '0 8px 24px rgba(245,158,11,0.2)', iconBg: 'rgba(245,158,11,0.12)', iconColor: '#fbbf24', border: 'rgba(245,158,11,0.15)' },
    violet: { gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', shadow: '0 8px 24px rgba(139,92,246,0.2)', iconBg: 'rgba(139,92,246,0.12)', iconColor: '#a78bfa', border: 'rgba(139,92,246,0.15)' },
    red: { gradient: 'linear-gradient(135deg, #ef4444, #f43f5e)', shadow: '0 8px 24px rgba(239,68,68,0.2)', iconBg: 'rgba(239,68,68,0.12)', iconColor: '#f87171', border: 'rgba(239,68,68,0.15)' },
  };
  const theme = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(12, 18, 36, 0.92) 100%)',
        border: `1px solid ${theme.border}`,
        borderRadius: '20px',
        padding: '24px',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-24px', right: '-24px', width: '96px', height: '96px', background: theme.iconBg, borderRadius: '50%', filter: 'blur(30px)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.iconBg, color: theme.iconColor, fontSize: '20px', border: `1px solid ${theme.border}`,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '4px' }}>{label}</p>
          <p style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value || 0}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Notification List ── */
const NotificationList = ({ notifications = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(12, 18, 36, 0.92) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '20px',
      padding: '24px',
    }}
  >
    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.8)' }} />
      Notifications
      {notifications.length > 0 && (
        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', marginLeft: '4px' }}>
          {notifications.length}
        </span>
      )}
    </h3>
    {notifications.length === 0 ? (
      <p style={{ fontSize: '13px', color: '#475569' }}>No notifications</p>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.map((n, i) => (
          <div key={n._id || i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
            <span style={{ fontSize: '14px' }}>🔔</span>
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{n.message}</span>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

/* ── Chart Wrapper ── */
const ChartCard = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(12, 18, 36, 0.92) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '20px',
      padding: '24px',
    }}
  >
    <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon} {title}
    </h3>
    <div style={{ height: '280px' }}>
      {children}
    </div>
  </motion.div>
);

/* ── MAIN COMPONENT ── */
export const DevDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/dashboard/all", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDashboard(res.data));
  }, []);

  if (!dashboard) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-3 border-white/10 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  const { summary = {}, charts = {}, notifications = [] } = dashboard;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) + ", " + now.toLocaleTimeString("en-GB");

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10 px-4 md:px-8 py-8 md:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ marginBottom: '4px' }}>
                Developer Dashboard
              </h1>
              <p className="text-slate-500 text-sm">Track your development progress and tasks</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>LIVE • {timeStr}</span>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <KpiCard icon={<FaTasks />} label="My Tasks" value={summary.myTasks} color="blue" delay={0.05} />
          <KpiCard icon={<FaBug />} label="My Bugs" value={summary.myBugs} color="red" delay={0.1} />
        </div>

        {/* Charts + Notifications Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <ChartCard title="Issues by Status" icon="📊" delay={0.15}>
            <IssuesStatusChart data={charts.issuesByStatus || []} />
          </ChartCard>
          <ChartCard title="Issues by Priority" icon="⚡" delay={0.2}>
            <IssuesPriorityChart data={charts.issuesByPriority || []} />
          </ChartCard>
          <NotificationList notifications={notifications} />
        </div>

        {/* Bugs Chart */}
        <div style={{ marginBottom: '32px' }}>
          <ChartCard title="Bugs by Status" icon="🐛" delay={0.25}>
            <BugsStatusChart data={charts.bugsByStatus || []} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
