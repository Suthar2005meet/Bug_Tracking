import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { normalizeChartSeries } from "../../utils/chartData"

const ROLE_COLORS = ["#10B981", "#34D399", "#6EE7B7", "#059669", "#A7F3D0", "#047857"]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(0,20,12,0.97)",
        border: "1px solid rgba(16,185,129,0.3)",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#e2e8f0",
        fontSize: 13,
        fontFamily: "DM Mono, monospace"
      }}>
        <div style={{ fontWeight: 700, color: "#34D399" }}>{payload[0].name}</div>
        <div>Count: <b style={{ color: "#6EE7B7" }}>{payload[0].value}</b></div>
      </div>
    )
  }
  return null
}

const UsersRoleChart = ({ data = [] }) => {
  const formattedData = normalizeChartSeries(data).map((item, i) => ({
    name: item.name || "Unknown",
    value: item.value || 0,
    color: ROLE_COLORS[i % ROLE_COLORS.length]
  }))

  const total = formattedData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="glass p-5 flex flex-col items-stretch bg-gradient-to-br from-[#001a0e] via-[#002a1a] to-[#001a0e] border border-emerald-500/20 rounded-2xl min-h-[360px] lg:min-h-[320px] relative overflow-hidden">
      {/* Center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 160, height: 160, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>👥</span>
        <h3 style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#10B981",
          fontFamily: "'DM Mono', monospace"
        }}>Users By Role</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 flex-1">
        {/* Donut Container */}
        <div className="relative w-full aspect-square max-w-[200px] lg:max-w-none lg:w-[50%] lg:h-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="95%"
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center", pointerEvents: "none"
          }}>
            <div style={{ color: "#10B981", fontSize: 22, fontWeight: 800, fontFamily: "DM Mono, monospace", lineHeight: 1 }}>
              {total}
            </div>
            <div style={{ color: "#64748b", fontSize: 10, fontFamily: "DM Mono, monospace", letterSpacing: "0.1em" }}>
              TOTAL
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full flex flex-col gap-2 min-w-0">
          {formattedData.map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-white/[0.03] border border-white/[0.04] p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                <span className="text-slate-300 text-[11px] font-bold tracking-wide truncate">{item.name}</span>
              </div>
              <span style={{ color: item.color, fontSize: 13, fontWeight: 800, fontFamily: "DM Mono, monospace" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UsersRoleChart
