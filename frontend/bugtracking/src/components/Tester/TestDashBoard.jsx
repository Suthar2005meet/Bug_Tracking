import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaBug, FaTasks } from "react-icons/fa";

import BugsStatusChart from "../charts/BugsStatusChart";
import BugsPriorityChart from "../charts/BugsPriorityChart";
import { AuthContext } from "../../AuthProvider";
import { findChartSeries, getChartCount } from "../../utils/chartData";

const BUG_STATUS_CHART_KEYS = [
  ["bug", "status"],
  ["bugs", "status"],
  ["bug", "state"],
  ["bugs", "state"],
  ["tester", "bug", "status"],
  ["tester", "bugs", "status"],
  ["my", "bug", "status"],
  ["my", "bugs", "status"],
];

const BUG_PRIORITY_CHART_KEYS = [
  ["bug", "priority"],
  ["bugs", "priority"],
  ["tester", "bug", "priority"],
  ["tester", "bugs", "priority"],
  ["my", "bug", "priority"],
  ["my", "bugs", "priority"],
];

/* ───────────────── Helpers ───────────────── */

const firstDefined = (...values) => {
  for (const v of values) {
    if (v !== undefined && v !== null && !isNaN(Number(v))) {
      return Number(v);
    }
  }
  return 0;
};

const totalCount = (items = []) =>
  items.reduce((sum, item) => sum + getChartCount(item), 0);

/* ───────────────── Tester Dashboard ───────────────── */

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
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchDashboard();
  }, [userId]);

  if (loading) return <div style={S.center}>Loading...</div>;
  if (!dashboard) return <div style={S.center}>Failed to load data</div>;

  const { summary = {}, charts = {}, notifications = [] } = dashboard;

  /* ───────── Charts Data ───────── */

  const pickChartData = (source = {}, keyGroups = []) => {
    for (const tokens of keyGroups) {
      const series = findChartSeries(source, tokens);
      if (series.length > 0) return series;
    }

    return [];
  };

  const bugsStatusData = pickChartData(charts, BUG_STATUS_CHART_KEYS);

  const bugsPriorityData = pickChartData(charts, BUG_PRIORITY_CHART_KEYS);

  /* ───────── KPI Values ───────── */

  const myBugsCount = firstDefined(
    summary.myBugs,
    summary.assignedBugs,
    summary.totalBugs,
    totalCount(bugsStatusData)
  );

  const myTasksCount = firstDefined(
    summary.myTasks,
    summary.assignedTasks,
    summary.totalTasks
  );

  return (
    <div style={S.page}>
      <h1 style={S.title}>Tester Dashboard</h1>

      {/* ───────── KPI Section ───────── */}
      <div style={S.kpiRow}>
        <KpiCard
          icon={<FaBug />}
          label="My Bugs"
          value={myBugsCount}
          color="#FF453A"
        />
        <KpiCard
          icon={<FaTasks />}
          label="Assigned Tasks"
          value={myTasksCount}
          color="#FBBF24"
        />
      </div>

      {/* ───────── Charts Section ───────── */}
      <div style={S.chartGrid}>
        {bugsStatusData.length > 0 ? (
          <BugsStatusChart data={bugsStatusData} />
        ) : (
          <Empty message="No Bug Status Data" />
        )}

        {bugsPriorityData.length > 0 ? (
          <BugsPriorityChart data={bugsPriorityData} />
        ) : (
          <Empty message="No Bug Priority Data" />
        )}
      </div>

      {/* ───────── Notifications ───────── */}
      <div style={S.notificationBox}>
        <h3>Notifications ({notifications.length})</h3>

        {notifications.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No notifications</p>
        ) : (
          notifications.map((note, i) => (
            <div key={note._id || i} style={S.notificationItem}>
              🔔 {note.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ───────────────── KPI Card ───────────────── */

const KpiCard = ({ icon, label, value, color }) => (
  <div style={{ ...S.kpiCard, borderColor: `${color}40` }}>
    <div style={{ ...S.kpiIcon, background: `${color}15`, color }}>
      {icon}
    </div>
    <div>
      <p style={S.kpiLabel}>{label}</p>
      <h2 style={{ ...S.kpiValue, color }}>{value ?? 0}</h2>
    </div>
  </div>
);

const Empty = ({ message }) => (
  <div style={S.empty}>{message}</div>
);

/* ───────────────── Styles ───────────────── */

const S = {
  page: {
    padding: 30,
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "DM Mono, monospace",
  },
  title: {
    marginBottom: 25,
  },
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
  kpiRow: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
  },
  kpiCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    background: "#1e293b",
    border: "1px solid",
    display: "flex",
    gap: 15,
    alignItems: "center",
  },
  kpiIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
  },
  kpiLabel: {
    margin: 0,
    fontSize: 12,
    color: "#94a3b8",
  },
  kpiValue: {
    margin: 0,
    fontSize: 26,
    fontWeight: "bold",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 30,
  },
  empty: {
    background: "#1e293b",
    padding: 40,
    borderRadius: 12,
    textAlign: "center",
    color: "#64748b",
  },
  notificationBox: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
  },
  notificationItem: {
    padding: "8px 0",
    borderBottom: "1px solid #334155",
    fontSize: 13,
  },
};
