import React from "react"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import { normalizeChartSeries } from "../../utils/chartData"

const COLORS = ["#6EE7F7", "#A78BFA", "#34D399", "#F472B6", "#FBBF24", "#60A5FA", "#F87171"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(15,23,42,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "10px 16px",
        color: "#e2e8f0",
        fontSize: "13px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        <div style={{ color: COLORS[0] }}>Count: <b>{payload[0].value}</b></div>
      </div>
    )
  }
  return null
}

const BarChartComponent = ({ title, data = [] }) => {
  const formattedData = normalizeChartSeries(data).map(item => ({
    name: item.name || "Unknown",
    value: item.value || 0
  }))

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      width: "100%",
      height: "320px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative glow */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 160, height: 160,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <h3 style={{
        margin: "0 0 20px",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#94a3b8",
        fontFamily: "'DM Mono', monospace"
      }}>
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="78%">
        <ReBarChart data={formattedData} barCategoryGap="35%">
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Mono, monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Mono, monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {formattedData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartComponent
