import React from 'react'
import BugChart from '../charts/BugChart'
import ProjectChart from '../charts/ProjectChart'
import UserChart from '../charts/UserChart'
import { FaBug, FaBox, FaUsers, FaChartLine } from 'react-icons/fa'

const stats = [
  {
    label: "Total Bugs",
    value: "124",
    change: "+12 this week",
    up: false,
    icon: <FaBug />,
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    label: "Active Projects",
    value: "18",
    change: "+3 this month",
    up: true,
    icon: <FaBox />,
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
  {
    label: "Total Users",
    value: "340",
    change: "+27 this month",
    up: true,
    icon: <FaUsers />,
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    label: "Resolution Rate",
    value: "87%",
    change: "+5% vs last month",
    up: true,
    icon: <FaChartLine />,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
]

export const AdDash = () => {
  return (
    <div className="space-y-8">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Welcome back, Admin — here's what's happening.</p>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 rounded-xl border ${stat.border} bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color} text-base`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 leading-tight">{stat.value}</p>
              <p className={`text-[10px] font-medium mt-0.5 ${stat.up ? "text-emerald-500" : "text-red-400"}`}>
                {stat.up ? "↑" : "↓"} {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bug Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Bug Overview</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Reported vs resolved bugs</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1">
              <FaBug className="text-[9px]" /> Bugs
            </span>
          </div>
          <BugChart />
        </div>

        {/* Project Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">Project Status</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Active, paused & completed</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-500 bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1">
              <FaBox className="text-[9px]" /> Projects
            </span>
          </div>
          <ProjectChart />
        </div>

      </div>

      {/* User Chart — full width */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">User Growth</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">New registrations over time</p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-500 bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1">
            <FaUsers className="text-[9px]" /> Users
          </span>
        </div>
        <UserChart />
      </div>

    </div>
  )
}