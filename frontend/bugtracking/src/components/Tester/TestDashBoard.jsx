import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaBug, FaTasks } from "react-icons/fa";

import BugsStatusChart from "../charts/BugsStatusChart";
import BugsPriorityChart from "../charts/BugsPriorityChart";
import { AuthContext } from "../../AuthProvider";
import { findChartSeries, getChartCount } from "../../utils/chartData";
import { motion } from "framer-motion";

const BUG_STATUS_CHART_KEYS = [
  ["bug", "status"], ["bugs", "status"], ["bug", "state"], ["bugs", "state"],
  ["tester", "bug", "status"], ["tester", "bugs", "status"],
  ["my", "bug", "status"], ["my", "bugs", "status"],
];

const BUG_PRIORITY_CHART_KEYS = [
  ["bug", "priority"], ["bugs", "priority"],
  ["tester", "bug", "priority"], ["tester", "bugs", "priority"],
  ["my", "bug", "priority"], ["my", "bugs", "priority"],
];

const firstDefined = (...values) => {
  for (const v of values) {
    if (v !== undefined && v !== null && !isNaN(Number(v))) return Number(v);
  }
  return 0;
};

const totalCount = (items = []) =>
  items.reduce((sum, item) => sum + getChartCount(item), 0);

export const TestDashBoard = () => {
  const { userId } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/dashboard/all/${userId}`);
        setDashboard(res.data);
      } catch (err) {
        console.error("Tester Dashboard Error:", err);
        setDashboard(null);
      } finally { setLoading(false); }
    };
    if (userId) fetchDashboard();
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-3 border-white/10 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
  if (!dashboard) return (
    <div className="flex items-center justify-center min-h-[50vh] text-slate-500">Failed to load data</div>
  );

  const { summary = {}, charts = {}, notifications = [] } = dashboard;

  const pickChartData = (source = {}, keyGroups = []) => {
    for (const tokens of keyGroups) {
      const series = findChartSeries(source, tokens);
      if (series.length > 0) return series;
    }
    return [];
  };

  const bugsStatusData = pickChartData(charts, BUG_STATUS_CHART_KEYS);
  const bugsPriorityData = pickChartData(charts, BUG_PRIORITY_CHART_KEYS);

  const myBugsCount = firstDefined(summary.myBugs, summary.assignedBugs, summary.totalBugs, totalCount(bugsStatusData));
  const myTasksCount = firstDefined(summary.myTasks, summary.assignedTasks, summary.totalTasks);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />
      
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 mb-2">Quality Assurance</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Tester Dashboard</h1>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass p-5 flex items-center gap-4 border-l-[3px] border-l-red-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-400 text-lg">
              <FaBug />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">My Bugs</p>
              <h2 className="text-2xl font-extrabold text-red-400">{myBugsCount}</h2>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass p-5 flex items-center gap-4 border-l-[3px] border-l-amber-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 text-lg">
              <FaTasks />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Assigned Tasks</p>
              <h2 className="text-2xl font-extrabold text-amber-400">{myTasksCount}</h2>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass p-5"
          >
            {bugsStatusData.length > 0 ? (
              <BugsStatusChart data={bugsStatusData} />
            ) : (
              <div className="text-center py-10 text-slate-600">No Bug Status Data</div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass p-5"
          >
            {bugsPriorityData.length > 0 ? (
              <BugsPriorityChart data={bugsPriorityData} />
            ) : (
              <div className="text-center py-10 text-slate-600">No Bug Priority Data</div>
            )}
          </motion.div>
        </div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass p-5"
        >
          <h3 className="text-sm font-bold text-white mb-4">Notifications ({notifications.length})</h3>
          {notifications.length === 0 ? (
            <p className="text-slate-600 text-sm">No notifications</p>
          ) : (
            notifications.map((note, i) => (
              <div key={note._id || i} className="py-2.5 border-b border-white/[0.04] text-sm text-slate-400 last:border-b-0">
                🔔 {note.message}
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};
