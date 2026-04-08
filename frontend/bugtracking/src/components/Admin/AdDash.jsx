import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaFolder, FaTasks, FaBug, FaStream } from "react-icons/fa";

import UsersRoleChart from "../charts/UsersRoleChart";
import IssuesStatusChart from "../charts/IssuesStatusChart";
import BugsStatusChart from "../charts/BugsStatusChart";
import SprintStatusChart from "../charts/SprintStatusChart";

export const AdDash = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/dashboard/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(res.data);
    };
    fetchDashboard();
  }, []);

  if (!dashboard) return <div className="p-10">Loading...</div>;

  const { summary = {}, charts = {}, recentActivity = [] } = dashboard;

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <Kpi icon={<FaUsers />} label="Users" value={summary.totalUsers} />
        <Kpi icon={<FaFolder />} label="Projects" value={summary.totalProjects} />
        <Kpi icon={<FaTasks />} label="Issues" value={summary.totalIssues} />
        <Kpi icon={<FaBug />} label="Bugs" value={summary.totalBugs} />
        <Kpi icon={<FaStream />} label="Sprints" value={summary.totalSprints} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UsersRoleChart data={charts.usersByRole || []} />
        <IssuesStatusChart data={charts.issuesByStatus || []} />
        <BugsStatusChart data={charts.bugsByStatus || []} />
        <SprintStatusChart data={charts.sprintStatus || []} />
      </div>

      {/* Activity */}
      <ActivityList activity={recentActivity} />
    </div>
  );
};

const Kpi = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-xl shadow flex gap-4 items-center">
    <div className="text-indigo-500 text-2xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <h2 className="text-xl font-bold">{value || 0}</h2>
    </div>
  </div>
);

const ActivityList = ({ activity }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="font-semibold mb-4">Recent Activity</h2>
    {activity.map((a) => (
      <div key={a._id} className="border-b py-2">
        <p>{a.user?.name} - {a.action}</p>
      </div>
    ))}
  </div>
);