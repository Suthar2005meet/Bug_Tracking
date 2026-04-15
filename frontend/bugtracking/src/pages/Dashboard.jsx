import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaFolder, FaTasks, FaBug, FaStream } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Charts
import UsersRoleChart from "../components/charts/UsersRoleChart";
import IssuesStatusChart from "../components/charts/IssuesStatusChart";
import IssuesPriorityChart from "../components/charts/IssuesPriorityChart";
import BugsStatusChart from "../components/charts/BugsStatusChart";
import BugsPriorityChart from "../components/charts/BugsPriorityChart";
import SprintStatusChart from "../components/charts/SprintStatusChart";
import { AuthContext } from "../AuthProvider";
import { findChartSeries, getChartCount } from "../utils/chartData";
import { NotificationDropdown } from "../components/common/NotificationDropdown";

const ISSUE_STATUS_CHART_KEYS = [ ["issue", "status"], ["issues", "status"], ["issue", "state"], ["issues", "state"], ["task", "status"], ["tasks", "status"], ["task", "state"], ["tasks", "state"], ["assigned", "issue", "status"], ["assigned", "issues", "status"], ["assigned", "task", "status"], ["assigned", "tasks", "status"], ["my", "issue", "status"], ["my", "issues", "status"], ["my", "task", "status"], ["my", "tasks", "status"], ];
const ISSUE_PRIORITY_CHART_KEYS = [ ["issue", "priority"], ["issues", "priority"], ["task", "priority"], ["tasks", "priority"], ["assigned", "issue", "priority"], ["assigned", "issues", "priority"], ["assigned", "task", "priority"], ["assigned", "tasks", "priority"], ["my", "issue", "priority"], ["my", "issues", "priority"], ["my", "task", "priority"], ["my", "tasks", "priority"], ];
const BUG_STATUS_CHART_KEYS = [ ["bug", "status"], ["bugs", "status"], ["bug", "state"], ["bugs", "state"], ["my", "bug", "status"], ["my", "bugs", "status"], ["assigned", "bug", "status"], ["assigned", "bugs", "status"], ["tester", "bug", "status"], ["tester", "bugs", "status"], ["reported", "bug", "status"], ["reported", "bugs", "status"], ];
const BUG_PRIORITY_CHART_KEYS = [ ["bug", "priority"], ["bugs", "priority"], ["my", "bug", "priority"], ["my", "bugs", "priority"], ["assigned", "bug", "priority"], ["assigned", "bugs", "priority"], ["tester", "bug", "priority"], ["tester", "bugs", "priority"], ["reported", "bug", "priority"], ["reported", "bugs", "priority"], ];
const SPRINT_STATUS_CHART_KEYS = [ ["sprint", "status"], ["sprints", "status"], ["sprint", "state"], ];
const USERS_ROLE_CHART_KEYS = [ ["user", "role"], ["users", "role"], ["role"], ];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const firstArray = (...values) => {
  for (const v of values) if (Array.isArray(v) && v.length > 0) return v;
  for (const v of values) if (Array.isArray(v)) return v;
  return [];
};

const firstDefined = (...values) => {
  for (const v of values)
    if (v !== undefined && v !== null && !isNaN(Number(v))) return Number(v);
  return 0;
};

const totalCount = (items = []) =>
  items.reduce((s, i) => s + getChartCount(i), 0);

const normalizeRole = (value = "") => value.toLowerCase().replace(/[\s_]+/g, "");

const pickChartData = (source = {}, keyGroups = []) => {
  for (const tokens of keyGroups) {
    const series = findChartSeries(source, tokens);
    if (series.length > 0) return series;
  }
  return [];
};

const hasChartData = (source = {}, keys = []) =>
  pickChartData(source, keys).length > 0;

const preferDashboardValue = (primary, fallback) => {
  if (Array.isArray(primary)) {
    if (primary.length > 0) return primary;
    return Array.isArray(fallback) ? fallback : primary;
  }
  return primary ?? fallback;
};

const mergeDashboardSection = (primary = {}, fallback = {}) => {
  const merged = {};
  const keys = new Set([...Object.keys(fallback || {}), ...Object.keys(primary || {})]);
  for (const key of keys) {
    merged[key] = preferDashboardValue(primary?.[key], fallback?.[key]);
  }
  return merged;
};

const mergeDashboardData = (primary, fallback) => {
  if (!primary) return fallback || null;
  if (!fallback) return primary;
  return {
    ...fallback,
    ...primary,
    meta: mergeDashboardSection(primary.meta, fallback.meta),
    summary: mergeDashboardSection(primary.summary, fallback.summary),
    charts: mergeDashboardSection(primary.charts, fallback.charts),
    recentActivity: preferDashboardValue(primary.recentActivity, fallback.recentActivity) || [],
    notifications: preferDashboardValue(primary.notifications, fallback.notifications) || [],
  };
};

const shouldHydrateTesterCharts = (data, normalizedRole) => {
  if (normalizedRole !== "tester") return false;
  const source = data?.charts || {};
  return !hasChartData(source, BUG_STATUS_CHART_KEYS) || !hasChartData(source, BUG_PRIORITY_CHART_KEYS);
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { id } = useParams();
  const { userId, role: authRole } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const dashboardUserId = id || userId;
  const canHydrateFromCurrentUserDashboard = !id || dashboardUserId === userId;

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        let scopedData = null;
        let fallbackData = null;

        if (dashboardUserId) {
          try {
            const res = await axios.get(`/dashboard/all/${dashboardUserId}`);
            scopedData = res.data;
          } catch (err) {
            scopedData = null;
          }
        }

        const normalizedFetchRole = normalizeRole(scopedData?.meta?.role || authRole);
        const needsFallbackDashboard =
          !scopedData ||
          (canHydrateFromCurrentUserDashboard &&
            shouldHydrateTesterCharts(scopedData, normalizedFetchRole));

        if (needsFallbackDashboard) {
          try {
            const res = await axios.get(`/dashboard/all/${userId}`);
            fallbackData = res.data;
          } catch (err) {
            if (!scopedData) throw err;
          }
        }

        const data = mergeDashboardData(scopedData, fallbackData);

        if (!data) throw new Error("No dashboard data received");
        setDashboard(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [authRole, canHydrateFromCurrentUserDashboard, dashboardUserId]);

  if (loading) return <LoadingScreen />;
  if (!dashboard) return <ErrorScreen />;

  const {
    meta = {}, summary = {}, charts = {},
    recentActivity = [], notifications = [],
  } = dashboard;

  const role = meta?.role || "";
  const normalizedRole = normalizeRole(role);
  const roleTitle = normalizedRole === "projectmanager" ? "Project Manager" : role || "User";

  const isAdmin = normalizedRole === "admin";
  const isProjectManager = normalizedRole === "projectmanager";
  const isDeveloper = normalizedRole === "developer";
  const isTester = normalizedRole === "tester";

  const issuesStatusData = pickChartData(charts, ISSUE_STATUS_CHART_KEYS);
  const generatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleTimeString() : new Date().toLocaleTimeString();
  const issuesPriorityData = pickChartData(charts, ISSUE_PRIORITY_CHART_KEYS);
  const bugsStatusData = pickChartData(charts, BUG_STATUS_CHART_KEYS);
  const bugsPriorityData = pickChartData(charts, BUG_PRIORITY_CHART_KEYS);
  const sprintStatusData = pickChartData(charts, SPRINT_STATUS_CHART_KEYS);
  const usersRoleData = pickChartData(charts, USERS_ROLE_CHART_KEYS);

  const myTasksCount = firstDefined(
    summary.myTasks, summary.myIssues, summary.assignedTasks, summary.assignedIssues,
    isAdmin || isProjectManager ? summary.totalTasks : undefined,
    isAdmin || isProjectManager ? summary.totalIssues : undefined,
    totalCount(issuesStatusData)
  );
  const myBugsCount = firstDefined(
    summary.myBugs, summary.assignedBugs, summary.reportedBugs,
    isAdmin || isProjectManager ? summary.totalBugs : undefined,
    totalCount(bugsStatusData)
  );

  return (
    <div className="relative w-full">
      <div className="pointer-events-none fixed inset-0 bg-mesh opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10 pb-6 border-b border-white/[0.06]"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 m-0">
                {roleTitle} <span className="text-cyan-400">Dashboard</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Overview of your workspace metrics and activity
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  LIVE • {generatedAt}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── ADMIN ─── */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 lg:mb-10">
              <KpiCard icon={<FaUsers />}  label="Users"    value={summary.totalUsers}    color="cyan" />
              <KpiCard icon={<FaFolder />} label="Projects" value={summary.totalProjects} color="violet" />
              <KpiCard icon={<FaTasks />}  label="Issues"   value={summary.totalIssues}   color="emerald" />
              <KpiCard icon={<FaBug />}    label="Bugs"     value={summary.totalBugs}     color="rose" />
              <KpiCard icon={<FaStream />} label="Sprints"  value={summary.totalSprints}  color="amber" />
            </div>
            <TwoColLayout
              charts={
                <>
                  <ChartCard><UsersRoleChart data={usersRoleData} /></ChartCard>
                  <ChartCard><IssuesStatusChart data={issuesStatusData} /></ChartCard>
                  <ChartCard><BugsStatusChart data={bugsStatusData} /></ChartCard>
                  <ChartCard><SprintStatusChart data={sprintStatusData} /></ChartCard>
                </>
              }
              side={<ActivityPanel activity={recentActivity} />}
            />
          </motion.div>
        )}

        {/* ─── PROJECT MANAGER ─── */}
        {isProjectManager && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 lg:mb-10">
              <KpiCard icon={<FaFolder />} label="Projects" value={summary.totalProjects} color="violet" />
              <KpiCard icon={<FaTasks />}  label="Issues"   value={summary.totalIssues}   color="emerald" />
              <KpiCard icon={<FaBug />}    label="Bugs"     value={summary.totalBugs}     color="rose" />
              <KpiCard icon={<FaStream />} label="Sprints"  value={summary.totalSprints}  color="amber" />
            </div>
            <TwoColLayout
              charts={
                <>
                  <ChartCard><IssuesStatusChart data={issuesStatusData} /></ChartCard>
                  <ChartCard><IssuesPriorityChart data={issuesPriorityData} /></ChartCard>
                  <ChartCard><BugsStatusChart data={bugsStatusData} /></ChartCard>
                  <ChartCard><BugsPriorityChart data={bugsPriorityData} /></ChartCard>
                  <ChartCard><SprintStatusChart data={sprintStatusData} /></ChartCard>
                </>
              }
              side={<ActivityPanel activity={recentActivity} />}
            />
          </motion.div>
        )}

        {/* ─── DEVELOPER ─── */}
        {isDeveloper && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 lg:mb-10">
              <KpiCard icon={<FaTasks />} label="My Tasks" value={myTasksCount} color="emerald" />
              <KpiCard icon={<FaBug />}   label="My Bugs"  value={myBugsCount}  color="rose" />
            </div>
            <TwoColLayout
              charts={
                <>
                  <ChartCard><IssuesStatusChart data={issuesStatusData} /></ChartCard>
                  <ChartCard><IssuesPriorityChart data={issuesPriorityData} /></ChartCard>
                  <ChartCard><BugsStatusChart data={bugsStatusData} /></ChartCard>
                </>
              }
              side={<ActivityPanel activity={recentActivity} />}
            />
          </motion.div>
        )}

        {/* ─── TESTER ─── */}
        {isTester && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 lg:mb-10">
              <KpiCard icon={<FaBug />}   label="My Bugs"         value={myBugsCount}  color="rose" />
              <KpiCard icon={<FaTasks />} label="Assigned Tasks"  value={myTasksCount} color="amber" />
            </div>
            <TwoColLayout
              charts={
                <>
                  <ChartCard><BugsStatusChart data={bugsStatusData} /></ChartCard>
                  <ChartCard><BugsPriorityChart data={bugsPriorityData} /></ChartCard>
                </>
              }
              side={<ActivityPanel activity={recentActivity} />}
            />
          </motion.div>
        )}

        {!isAdmin && !isProjectManager && !isDeveloper && !isTester && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl opacity-50 mb-4 tracking-widest animate-pulse">⚠️</div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">
              No dashboard configured for role: <span className="text-white">{role || "Unknown"}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default Dashboard;

// ─── Layout Primitives ────────────────────────────────────────────────────────

const TwoColLayout = ({ charts, side }) => (
  <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
    <div className="flex-[3] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts}
    </div>
    <div className="flex-1 w-full lg:sticky lg:top-24 flex flex-col gap-6">
      {side}
    </div>
  </div>
);

const ChartCard = ({ children }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-[#0f172a]/95 border border-white/[0.06] rounded-[24px] p-6 shadow-2xl transition-all duration-300"
  >
    {children}
  </motion.div>
);

const KpiCard = ({ icon, label, value, color }) => {
  const colorMap = {
    cyan:    { iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400',    border: 'border-cyan-500/20',     bgGlow: 'from-cyan-500/5' },
    violet:  { iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400',  border: 'border-violet-500/20',   bgGlow: 'from-violet-500/5' },
    emerald: { iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', border: 'border-emerald-500/20',  bgGlow: 'from-emerald-500/5' },
    rose:    { iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400',    border: 'border-rose-500/20',     bgGlow: 'from-rose-500/5' },
    amber:   { iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400',   border: 'border-amber-500/20',    bgGlow: 'from-amber-500/5' },
  };
  const theme = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden p-6 rounded-[28px] border ${theme.border} bg-[#0f172a]/95 group transition-all duration-500`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${theme.bgGlow} to-transparent blur-2xl rounded-full transition-all duration-700 group-hover:scale-150 group-hover:opacity-60`} />
      
      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl border ${theme.border} ${theme.iconBg} ${theme.iconColor} shadow-inner transition-transform duration-500 group-hover:rotate-12`}>
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 m-0">
            {label}
          </p>
          <p className="text-3xl font-black text-slate-100 m-0 leading-none">
            {value ?? 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Side Panels ──────────────────────────────────────────────────────────────

const ActivityPanel = ({ activity = [] }) => (
  <div className="bg-[#0f172a]/95 border border-white/[0.06] rounded-[24px] overflow-hidden flex flex-col group transition-all duration-500 hover:border-emerald-500/20 shadow-2xl">
    <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06] bg-white/[0.02]">
      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-200 m-0 flex-1">
        Recent Activity
      </h3>
    </div>
    <div className="overflow-y-auto max-h-[500px] p-2 no-scrollbar">
      {activity.length === 0 ? <EmptyState label="No activity" /> : (
        activity.slice(0, 15).map((item, i) => (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            key={item._id || i} 
            className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-xl flex-shrink-0 border border-white/10 uppercase">
              {(item?.user?.name || "?")[0]}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-xs font-black text-slate-200 m-0 truncate leading-none">
                {item?.user?.name || "Unknown"}
                {item?.user?.role && (
                  <span className="ml-2 text-[8px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-sm">
                    {item.user.role}
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-500 font-medium m-0 leading-relaxed italic">
                {item.action}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  </div>
);

const NotificationPanel = ({ notifications = [] }) => (
  <div className="bg-[#0f172a]/95 border border-white/[0.06] rounded-[24px] overflow-hidden flex flex-col hover:border-amber-500/20 transition-all duration-500 shadow-2xl">
    <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06] bg-white/[0.02]">
      <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-200 m-0 flex-1">
        Notifications
      </h3>
      {notifications.length > 0 && (
        <span className="text-[9px] font-black text-white bg-red-500/20 border border-red-500/20 px-2 py-0.5 rounded-full">
          {notifications.length}
        </span>
      )}
    </div>
    <div className="overflow-y-auto max-h-[500px] p-2 no-scrollbar">
      {notifications.length === 0 ? <EmptyState label="All clear" /> : (
        notifications.map((note, i) => (
          <div key={note._id || i} className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all">
            <span className="text-base flex-shrink-0">🔔</span>
            <p className="text-xs text-slate-400 leading-relaxed m-0 font-medium">{note.message}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-12 opacity-40">
    <span className="text-2xl mb-2">—</span>
    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 m-0">{label}</p>
  </div>
);

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-2 border-white/5 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500 mt-6 animate-pulse">Initializing Dashboard Data</p>
  </div>
);

const ErrorScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 rounded-full bg-red-500/5 flex items-center justify-center text-2xl border border-red-500/10 mb-6 shadow-2xl text-red-500">⚠️</div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Initialization Failed</p>
    <p className="text-xs text-slate-600 mt-2">Could not retrieve workspace metrics at this time.</p>
  </div>
);
