import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaFolder, FaTasks, FaBug, FaStream } from "react-icons/fa";
import { useParams } from "react-router-dom";

// Charts
import UsersRoleChart from "../components/charts/UsersRoleChart";
import IssuesStatusChart from "../components/charts/IssuesStatusChart";
import IssuesPriorityChart from "../components/charts/IssuesPriorityChart";
import BugsStatusChart from "../components/charts/BugsStatusChart";
import BugsPriorityChart from "../components/charts/BugsPriorityChart";
import SprintStatusChart from "../components/charts/SprintStatusChart";
import { AuthContext } from "../AuthProvider";
import { findChartSeries, getChartCount } from "../utils/chartData";

const ISSUE_STATUS_CHART_KEYS = [
  ["issue", "status"],
  ["issues", "status"],
  ["issue", "state"],
  ["issues", "state"],
  ["task", "status"],
  ["tasks", "status"],
  ["task", "state"],
  ["tasks", "state"],
  ["assigned", "issue", "status"],
  ["assigned", "issues", "status"],
  ["assigned", "task", "status"],
  ["assigned", "tasks", "status"],
  ["my", "issue", "status"],
  ["my", "issues", "status"],
  ["my", "task", "status"],
  ["my", "tasks", "status"],
];

const ISSUE_PRIORITY_CHART_KEYS = [
  ["issue", "priority"],
  ["issues", "priority"],
  ["task", "priority"],
  ["tasks", "priority"],
  ["assigned", "issue", "priority"],
  ["assigned", "issues", "priority"],
  ["assigned", "task", "priority"],
  ["assigned", "tasks", "priority"],
  ["my", "issue", "priority"],
  ["my", "issues", "priority"],
  ["my", "task", "priority"],
  ["my", "tasks", "priority"],
];

const BUG_STATUS_CHART_KEYS = [
  ["bug", "status"],
  ["bugs", "status"],
  ["bug", "state"],
  ["bugs", "state"],
  ["my", "bug", "status"],
  ["my", "bugs", "status"],
  ["assigned", "bug", "status"],
  ["assigned", "bugs", "status"],
  ["tester", "bug", "status"],
  ["tester", "bugs", "status"],
  ["reported", "bug", "status"],
  ["reported", "bugs", "status"],
];

const BUG_PRIORITY_CHART_KEYS = [
  ["bug", "priority"],
  ["bugs", "priority"],
  ["my", "bug", "priority"],
  ["my", "bugs", "priority"],
  ["assigned", "bug", "priority"],
  ["assigned", "bugs", "priority"],
  ["tester", "bug", "priority"],
  ["tester", "bugs", "priority"],
  ["reported", "bug", "priority"],
  ["reported", "bugs", "priority"],
];

const SPRINT_STATUS_CHART_KEYS = [
  ["sprint", "status"],
  ["sprints", "status"],
  ["sprint", "state"],
];

const USERS_ROLE_CHART_KEYS = [
  ["user", "role"],
  ["users", "role"],
  ["role"],
];

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
  const keys = new Set([
    ...Object.keys(fallback || {}),
    ...Object.keys(primary || {}),
  ]);

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

  return (
    !hasChartData(source, BUG_STATUS_CHART_KEYS) ||
    !hasChartData(source, BUG_PRIORITY_CHART_KEYS)
  );
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
    summary.myBugs, summary.assignedBugs, summary.totalAssignedBugs,
    isAdmin || isProjectManager || isTester ? summary.totalBugs : undefined,
    totalCount(bugsStatusData)
  );

  const generatedAt = meta?.generatedAt
    ? new Date(meta.generatedAt).toLocaleString() : "";

  return (
    <div style={S.page}>
      <Blob style={{ top: -100, left: -80, width: 480, height: 480, background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />
      <Blob style={{ bottom: -80, right: -60, width: 380, height: 380, background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <Blob style={{ top: "40%", left: "50%", width: 300, height: 300, background: "radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <div style={S.header}>
        <div>
          <p style={S.headerSub}>{normalizedRole.toUpperCase()} PANEL</p>
          <h1 style={S.headerTitle}>{roleTitle} Dashboard</h1>
        </div>
        <div style={S.headerRight}>
          <div style={S.liveDot} />
          <span style={S.headerTime}>{generatedAt}</span>
        </div>
      </div>

      {/* ─── ADMIN ─────────────────────────────────── */}
      {isAdmin && (
        <>
          <KpiRow>
            <KpiCard icon={<FaUsers />}  label="Total Users"    value={summary.totalUsers}    accent="#6EE7F7" />
            <KpiCard icon={<FaFolder />} label="Total Projects" value={summary.totalProjects} accent="#A78BFA" />
            <KpiCard icon={<FaTasks />}  label="Total Issues"   value={summary.totalIssues}   accent="#34D399" />
            <KpiCard icon={<FaBug />}    label="Total Bugs"     value={summary.totalBugs}     accent="#F472B6" />
            <KpiCard icon={<FaStream />} label="Total Sprints"  value={summary.totalSprints}  accent="#FBBF24" />
          </KpiRow>
          <TwoColLayout
            charts={<>
              <UsersRoleChart    data={usersRoleData} />
              <IssuesStatusChart data={issuesStatusData} />
              <BugsStatusChart   data={bugsStatusData} />
              <SprintStatusChart data={sprintStatusData} />
            </>}
            side={<ActivityPanel activity={recentActivity} />}
          />
        </>
      )}

      {/* ─── PROJECT MANAGER ──────────────────────── */}
      {isProjectManager && (
        <>
          <KpiRow>
            <KpiCard icon={<FaFolder />} label="Projects" value={summary.totalProjects} accent="#A78BFA" />
            <KpiCard icon={<FaTasks />}  label="Issues"   value={summary.totalIssues}   accent="#34D399" />
            <KpiCard icon={<FaBug />}    label="Bugs"     value={summary.totalBugs}     accent="#F472B6" />
            <KpiCard icon={<FaStream />} label="Sprints"  value={summary.totalSprints}  accent="#FBBF24" />
          </KpiRow>
          <TwoColLayout
            charts={<>
              <IssuesStatusChart   data={issuesStatusData} />
              <IssuesPriorityChart data={issuesPriorityData} />
              <BugsStatusChart     data={bugsStatusData} />
              <BugsPriorityChart   data={bugsPriorityData} />
              <SprintStatusChart   data={sprintStatusData} />
            </>}
            side={<ActivityPanel activity={recentActivity} />}
          />
        </>
      )}

      {/* ─── DEVELOPER ────────────────────────────── */}
      {isDeveloper && (
        <>
          <KpiRow>
            <KpiCard icon={<FaTasks />} label="My Tasks" value={myTasksCount} accent="#34D399" />
            <KpiCard icon={<FaBug />}   label="My Bugs"  value={myBugsCount}  accent="#F472B6" />
          </KpiRow>
          <TwoColLayout
            charts={<>
              <IssuesStatusChart   data={issuesStatusData} />
              <IssuesPriorityChart data={issuesPriorityData} />
              <BugsStatusChart     data={bugsStatusData} />
            </>}
            side={<NotificationPanel notifications={notifications} />}
          />
        </>
      )}

      {/* ─── TESTER ───────────────────────────────── */}
      {isTester && (
        <>
          <KpiRow>
            <KpiCard icon={<FaBug />}   label="My Bugs"         value={myBugsCount}  accent="#FF453A" />
            <KpiCard icon={<FaTasks />} label="Assigned Tasks"  value={myTasksCount} accent="#FBBF24" />
          </KpiRow>
          <TwoColLayout
            charts={<>
              <BugsStatusChart data={bugsStatusData} />
              <BugsPriorityChart data={bugsPriorityData} />
            </>}
            side={<NotificationPanel notifications={notifications} />}
          />
        </>
      )}

      {!isAdmin && !isProjectManager && !isDeveloper && !isTester && (
        <div style={S.noRole}>
          No dashboard configured for role:{" "}
          <strong style={{ color: "#e2e8f0" }}>{role || "Unknown"}</strong>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// ─── Layout Primitives ────────────────────────────────────────────────────────

const Blob = ({ style }) => <div style={{ ...S.blob, ...style }} />;

/** Charts on left (2-col grid), sidebar panel on right */
const TwoColLayout = ({ charts, side }) => (
  <div style={S.twoCol}>
    <div style={S.chartsGrid}>{charts}</div>
    <div style={S.sideStack}>{side}</div>
  </div>
);

const KpiRow = ({ children }) => <div style={S.kpiRow}>{children}</div>;

const KpiCard = ({ icon, label, value, accent = "#6EE7F7" }) => (
  <div
    style={{ ...S.kpiCard, borderColor: `${accent}20` }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = `0 20px 48px ${accent}18`;
      e.currentTarget.style.borderColor = `${accent}44`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = `${accent}20`;
    }}
  >
    <div style={{ ...S.kpiIcon, background: `${accent}12`, color: accent }}>{icon}</div>
    <div>
      <p style={S.kpiLabel}>{label}</p>
      <h2 style={{ ...S.kpiValue, color: accent }}>{value ?? 0}</h2>
    </div>
    <div style={{ ...S.kpiAccentBar, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
  </div>
);

// ─── Side Panels ──────────────────────────────────────────────────────────────

const ActivityPanel = ({ activity = [] }) => (
  <SidePanel title="Recent Activity" dotColor="#10B981">
    {activity.length === 0 ? <EmptyState label="No recent activity" /> : (
      activity.map((item, i) => (
        <div key={item._id || i} style={S.feedItem}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={S.avatar}>{(item?.user?.name || "?")[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={S.feedName}>
              {item?.user?.name || "Unknown"}
              {item?.user?.role && <span style={S.feedRole}> · {item.user.role}</span>}
            </p>
            <p style={S.feedAction}>{item.action}</p>
          </div>
        </div>
      ))
    )}
  </SidePanel>
);

const NotificationPanel = ({ notifications = [] }) => (
  <SidePanel
    title="Notifications"
    dotColor="#FBBF24"
    badge={notifications.length > 0 ? notifications.length : null}
  >
    {notifications.length === 0 ? <EmptyState label="All caught up!" /> : (
      notifications.map((note, i) => (
        <div key={note._id || i} style={S.notifItem}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={S.notifBell}>🔔</div>
          <p style={S.notifMsg}>{note.message}</p>
        </div>
      ))
    )}
  </SidePanel>
);

const SidePanel = ({ title, dotColor = "#10B981", badge, children }) => (
  <div style={S.sidePanel}>
    <div style={S.panelHeader}>
      <span style={{ ...S.panelDot, background: dotColor, boxShadow: `0 0 8px ${dotColor}88` }} />
      <h3 style={S.panelTitle}>{title}</h3>
      {badge && <span style={S.badge}>{badge}</span>}
    </div>
    <div style={S.feedScroll}>{children}</div>
  </div>
);

const EmptyState = ({ label }) => (
  <div style={S.emptyState}>
    <span style={S.emptyDash}>—</span>
    <p style={S.emptyLabel}>{label}</p>
  </div>
);

const LoadingScreen = () => (
  <div style={{ ...S.centeredScreen, background: "#080d14" }}>
    <div style={S.spinner} />
    <p style={{ color: "#64748b", fontSize: 12, fontFamily: "DM Mono, monospace", marginTop: 14 }}>
      Loading dashboard…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ErrorScreen = () => (
  <div style={{ ...S.centeredScreen, background: "#080d14" }}>
    <FaBug size={32} color="#FF453A" />
    <p style={{ color: "#FF453A", marginTop: 12, fontFamily: "DM Mono, monospace", fontSize: 13 }}>
      Failed to load dashboard data.
    </p>
  </div>
);

// ─── Style Object ─────────────────────────────────────────────────────────────

const S = {
  page: {
    padding: "30px 28px 48px",
    minHeight: "100vh",
    background: "#080d14",
    fontFamily: "'DM Mono', monospace",
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },
  centeredScreen: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", height: "100vh",
  },
  spinner: {
    width: 36, height: 36, borderRadius: "50%",
    border: "3px solid rgba(16,185,129,0.12)",
    borderTop: "3px solid #10B981",
    animation: "spin 0.8s linear infinite",
  },

  /* Header */
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    marginBottom: 28, position: "relative", zIndex: 1,
    paddingBottom: 20,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  headerSub: {
    margin: "0 0 4px", fontSize: 10, fontWeight: 700,
    letterSpacing: "0.2em", color: "#10B981",
  },
  headerTitle: {
    margin: 0, fontSize: 24, fontWeight: 800,
    color: "#f1f5f9", letterSpacing: "-0.02em",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  liveDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#10B981", boxShadow: "0 0 8px #10B98199",
  },
  headerTime: { fontSize: 11, color: "#475569" },

  /* KPI */
  kpiRow: {
    display: "flex", flexWrap: "wrap", gap: 12,
    marginBottom: 24, position: "relative", zIndex: 1,
  },
  kpiCard: {
    flex: "1 1 150px", minWidth: 140,
    background: "linear-gradient(140deg, #0f172a 0%, #1a2235 100%)",
    borderRadius: 16, padding: "16px 18px",
    border: "1px solid",
    display: "flex", alignItems: "center", gap: 14,
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
    cursor: "default",
  },
  kpiIcon: {
    width: 40, height: 40, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, flexShrink: 0,
  },
  kpiLabel: {
    margin: "0 0 3px", fontSize: 9,
    color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase",
  },
  kpiValue: { margin: 0, fontSize: 24, fontWeight: 800, lineHeight: 1 },
  kpiAccentBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 2, opacity: 0.5,
  },

  /* Two-column layout */
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 18,
    alignItems: "start",
    position: "relative", zIndex: 1,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  sideStack: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    /* Sticky so it doesn't scroll away while charts are long */
    position: "sticky",
    top: 20,
  },

  /* Side panel */
  sidePanel: {
    background: "linear-gradient(145deg, #0d1525, #111827)",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  panelHeader: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  panelDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  panelTitle: {
    margin: 0, flex: 1,
    fontSize: 10, fontWeight: 700,
    letterSpacing: "0.15em", textTransform: "uppercase", color: "#94a3b8",
  },
  badge: {
    background: "rgba(251,191,36,0.12)", color: "#FBBF24",
    fontSize: 10, fontWeight: 700,
    padding: "2px 8px", borderRadius: 20,
    border: "1px solid rgba(251,191,36,0.22)",
  },
  feedScroll: { maxHeight: 520, overflowY: "auto", padding: "6px 0" },

  /* Activity feed items */
  feedItem: {
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "11px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    transition: "background 0.15s",
    cursor: "default",
  },
  avatar: {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg, #10B981, #059669)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  feedName: { margin: "0 0 2px", fontSize: 12, fontWeight: 600, color: "#e2e8f0" },
  feedRole: { fontSize: 10, color: "#64748b", fontWeight: 400 },
  feedAction: { margin: 0, fontSize: 11, color: "#64748b", lineHeight: 1.55 },

  /* Notification items */
  notifItem: {
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "11px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    transition: "background 0.15s",
    cursor: "default",
  },
  notifBell: { fontSize: 13, flexShrink: 0, marginTop: 1 },
  notifMsg: { margin: 0, fontSize: 11, color: "#94a3b8", lineHeight: 1.6 },

  /* Empty state */
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "36px 20px", gap: 6,
  },
  emptyDash: { fontSize: 20, color: "#1e293b" },
  emptyLabel: { margin: 0, fontSize: 10, color: "#475569", letterSpacing: "0.1em" },

  noRole: {
    textAlign: "center", color: "#64748b",
    padding: "80px 0", fontSize: 13,
  },
};
