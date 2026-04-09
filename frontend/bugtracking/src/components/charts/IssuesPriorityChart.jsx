import React from "react"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts"
import { normalizeChartSeries } from "../../utils/chartData"

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(10,5,30,0.97)",
        border: "1px solid rgba(139,92,246,0.35)",
        borderRadius: 10,
        padding: "10px 16px",
        color: "#e2e8f0",
        fontSize: 13,
        fontFamily: "DM Mono, monospace"
      }}>
        <div style={{ fontWeight: 700, color: "#a78bfa" }}>{label}</div>
        <div>Count: <b style={{ color: "#c4b5fd" }}>{payload[0].value}</b></div>
      </div>
    )
  }
  return null
}

const IssuesPriorityChart = ({ data = [] }) => {
  const formattedData = normalizeChartSeries(data).map(item => ({
    subject: item.name || "Unknown",
    value: item.value || 0,
  }))
  const hasData = formattedData.some((item) => item.value > 0)

  return (
    <div style={{
      background: "linear-gradient(145deg, #0a0514 0%, #130a2e 60%, #0a0514 100%)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(139,92,246,0.2)",
      boxShadow: "0 20px 60px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
      width: "100%",
      height: "320px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 16 }}>⚡</span>
        <h3 style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#a78bfa",
          fontFamily: "'DM Mono', monospace"
        }}>Issues By Priority</h3>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height="88%">
          <RadarChart data={formattedData} cx="50%" cy="52%">
            <PolarGrid stroke="rgba(139,92,246,0.2)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "DM Mono, monospace" }}
            />
            <PolarRadiusAxis
              tick={{ fill: "#64748b", fontSize: 9, fontFamily: "DM Mono, monospace" }}
              axisLine={false}
            />
            <Radar
              name="Priority"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{
          height: "88%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: 12,
          fontFamily: "DM Mono, monospace",
          letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          No priority data
        </div>
      )}
    </div>
  )
}

export default IssuesPriorityChart
