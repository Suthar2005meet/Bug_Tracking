import React from "react"
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts"
import { normalizeChartSeries } from "../../utils/chartData"

const SPRINT_COLORS = ["#F59E0B", "#FCD34D", "#FBBF24", "#F97316", "#FDE68A", "#D97706"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(28,18,0,0.97)",
        border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#e2e8f0",
        fontSize: 13,
        fontFamily: "DM Mono, monospace"
      }}>
        <div style={{ fontWeight: 700, color: "#FBBF24" }}>{label}</div>
        <div>Count: <b style={{ color: "#FCD34D" }}>{payload[0].value}</b></div>
      </div>
    )
  }
  return null
}

const SprintStatusChart = ({ data = [] }) => {
  const formattedData = normalizeChartSeries(data).map(item => ({
    name: item.name || "Unknown",
    value: item.value || 0
  })).sort((a, b) => b.value - a.value)

  return (
    <div style={{
      background: "linear-gradient(145deg, #1c1200 0%, #2d1f00 60%, #1c1200 100%)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(245,158,11,0.18)",
      boxShadow: "0 20px 60px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
      width: "100%",
      height: "320px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", bottom: -30, left: "30%",
        width: 180, height: 100, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 16 }}>🏃</span>
        <h3 style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#F59E0B",
          fontFamily: "'DM Mono', monospace"
        }}>Sprint Status Overview</h3>
      </div>

      <ResponsiveContainer width="100%" height="82%" minWidth={0} minHeight={0}>
        <ComposedChart data={formattedData} layout="vertical" margin={{ left: 0, right: 32 }}>
          <XAxis
            type="number"
            tick={{ fill: "#78716c", fontSize: 11, fontFamily: "DM Mono, monospace" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80}
            tick={{ fill: "#a8a29e", fontSize: 11, fontFamily: "DM Mono, monospace" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={22}>
            {formattedData.map((_, i) => (
              <Cell key={i} fill={`url(#amberGrad${i})`} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: "#F59E0B", fontSize: 11, fontFamily: "DM Mono, monospace", fontWeight: 700 }}
            />
          </Bar>
          <defs>
            {formattedData.map((_, i) => (
              <linearGradient key={i} id={`amberGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={SPRINT_COLORS[i % SPRINT_COLORS.length]} stopOpacity={0.9} />
                <stop offset="100%" stopColor={SPRINT_COLORS[(i + 2) % SPRINT_COLORS.length]} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SprintStatusChart
