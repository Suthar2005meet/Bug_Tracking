import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBug } from "react-icons/fa";
import BugsStatusChart from "../charts/BugsStatusChart";
import BugsPriorityChart from "../charts/BugsPriorityChart";
import { Kpi } from "../../pages/Kpi";
import { NotificationList } from "../../pages/NotificationList";

export const TestDashBoard = () => {
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
      <h1 className="text-2xl font-bold">Tester Dashboard</h1>

      <Kpi icon={<FaBug />} label="My Bugs" value={summary.myBugs} />

      <div className="grid lg:grid-cols-2 gap-6">
        <BugsStatusChart data={charts.bugsByStatus || []} />
        <BugsPriorityChart data={charts.bugsByPriority || []} />
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
};