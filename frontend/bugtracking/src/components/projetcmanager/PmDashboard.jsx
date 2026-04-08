import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFolder, FaTasks, FaBug, FaStream } from "react-icons/fa";

import IssuesStatusChart from "../charts/IssuesStatusChart";
import IssuesPriorityChart from "../charts/IssuesPriorityChart";
import BugsStatusChart from "../charts/BugsStatusChart";
import BugsPriorityChart from "../charts/BugsPriorityChart";

export const PmDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/dashboard/all", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setDashboard(res.data));
  }, []);

  if (!dashboard) return <div className="p-10">Loading...</div>;

  const { summary = {}, charts = {}, recentActivity = [] } = dashboard;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Project Manager Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi icon={<FaFolder />} label="Projects" value={summary.totalProjects} />
        <Kpi icon={<FaTasks />} label="Issues" value={summary.totalIssues} />
        <Kpi icon={<FaBug />} label="Bugs" value={summary.totalBugs} />
        <Kpi icon={<FaStream />} label="Sprints" value={summary.totalSprints} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <IssuesStatusChart data={charts.issuesByStatus || []} />
        <IssuesPriorityChart data={charts.issuesByPriority || []} />
        <BugsStatusChart data={charts.bugsByStatus || []} />
        <BugsPriorityChart data={charts.bugsByPriority || []} />
      </div>

      <ActivityList activity={recentActivity} />
    </div>
  );
};