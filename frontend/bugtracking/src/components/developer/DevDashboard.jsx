import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaBug } from "react-icons/fa";
import IssuesStatusChart from "../charts/IssuesStatusChart";
import BugsStatusChart from "../charts/BugsStatusChart";

export const DevDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/dashboard/all", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDashboard(res.data));
  }, []);

  if (!dashboard) return <div className="p-10">Loading...</div>;

  const { summary = {}, charts = {}, notifications = [] } = dashboard;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Developer Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        <Kpi icon={<FaTasks />} label="My Tasks" value={summary.myTasks} />
        <Kpi icon={<FaBug />} label="My Bugs" value={summary.myBugs} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <IssuesStatusChart data={charts.issuesByStatus || []} />
        <BugsStatusChart data={charts.bugsByStatus || []} />
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
};

const NotificationList = ({ notifications }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h2 className="font-semibold mb-4">Notifications</h2>
    {notifications.map(n => (
      <div key={n._id} className="border-b py-2">
        {n.message}
      </div>
    ))}
  </div>
);