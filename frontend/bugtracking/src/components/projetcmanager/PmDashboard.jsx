import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFolder, FaTasks, FaBug, FaStream } from "react-icons/fa";
import { motion } from "framer-motion";

import IssuesStatusChart from "../charts/IssuesStatusChart";
import IssuesPriorityChart from "../charts/IssuesPriorityChart";
import BugsStatusChart from "../charts/BugsStatusChart";
import BugsPriorityChart from "../charts/BugsPriorityChart";

// ─── INTERNAL COMPONENTS ───
const KpiCard = ({ icon, label, value, delay, color }) => {
  const colorMap = {
    blue: "from-blue-500 to-cyan-400 text-cyan-400 shadow-cyan-500/20 bg-blue-500/10 border-blue-500/20",
    emerald: "from-emerald-500 to-teal-400 text-emerald-400 shadow-emerald-500/20 bg-emerald-500/10 border-emerald-500/20",
    amber: "from-amber-500 to-orange-400 text-amber-400 shadow-orange-500/20 bg-amber-500/10 border-amber-500/20",
    violet: "from-violet-500 to-purple-400 text-violet-400 shadow-purple-500/20 bg-violet-500/10 border-violet-500/20",
  };
  const theme = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl group hover:bg-white/[0.04] transition-all duration-300`}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
      
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl flex items-center justify-center text-xl shadow-lg border backdrop-blur-md ${theme}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{label}</h3>
          <p className="text-3xl font-extrabold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value || 0}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityList = ({ activity }) => {
  if (!activity || !activity.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl pointer-events-none">
         <FaStream size={100} className="text-cyan-500" />
      </div>
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"></span>
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activity.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/[0.03] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group">
            <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
              📌
            </div>
            <div className="flex-grow">
              <p className="text-slate-300 text-sm font-medium"><span className="text-cyan-400 font-bold">{item.user}</span> {item.action}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── MAIN COMPONENT ───
export const PmDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/dashboard/all", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDashboard(res.data)).catch(err => console.error(err));
  }, []);

  if (!dashboard) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { summary = {}, charts = {}, recentActivity = [] } = dashboard;

  return (
    <div className="relative w-full pb-10">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-40 mix-blend-screen" />
      
      <div className="relative z-10 space-y-8">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-2">Workspace Overview</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Project Manager Dashboard</h1>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
          <KpiCard icon={<FaFolder />} label="Projects" value={summary.totalProjects} color="blue" delay={0.0} />
          <KpiCard icon={<FaTasks />} label="Issues" value={summary.totalIssues} color="violet" delay={0.1} />
          <KpiCard icon={<FaBug />} label="Bugs" value={summary.totalBugs} color="amber" delay={0.2} />
          <KpiCard icon={<FaStream />} label="Sprints" value={summary.totalSprints} color="emerald" delay={0.3} />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">📊 Issues by Status</h3>
            <div className="h-[300px]"><IssuesStatusChart data={charts.issuesByStatus || []} /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">📈 Issues by Priority</h3>
            <div className="h-[300px]"><IssuesPriorityChart data={charts.issuesByPriority || []} /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">🐛 Bugs by Status</h3>
            <div className="h-[300px]"><BugsStatusChart data={charts.bugsByStatus || []} /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">📉 Bugs by Priority</h3>
            <div className="h-[300px]"><BugsPriorityChart data={charts.bugsByPriority || []} /></div>
          </motion.div>
        </div>

        {/* Activity */}
        <ActivityList activity={recentActivity} />
        
      </div>
    </div>
  );
};