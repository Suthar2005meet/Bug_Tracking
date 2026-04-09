import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { normalizeChartSeries } from "../../utils/chartData"

const PRIORITY_COLORS = {
  Critical: "#FF2D55",
  critical: "#FF2D55",
  High: "#FF6B2B",
  high: "#FF6B2B",
  Medium: "#FFCC00",
  medium: "#FFCC00",
  Low: "#30D158",
  low: "#30D158",
  Unknown: "#636366"
}

const FALLBACK_COLORS = ["#FF2D55", "#FF6B2B", "#FFCC00", "#30D158", "#636366"]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(28,0,0,0.95)",
        border: "1px solid rgba(255,45,85,0.3)",
        borderRadius: "10px",
        padding: "10px 16px",
        color: "#fff",
        fontSize: "13px",
      }}>
        <div style={{ fontWeight: 700, color: payload[0].payload.fill }}>{payload[0].name}</div>
        <div>Count: <b style={{ color: "#FF6B2B" }}>{payload[0].value}</b></div>
      </div>
    )
  }
  return null
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={700} fontFamily="'DM Mono', monospace">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const BugsPriorityChart = ({ data = [] }) => {
  const formattedData = normalizeChartSeries(data).map((item, i) => ({
    name: item.name || "Unknown",
    value: item.value || 0,
    fill: PRIORITY_COLORS[item.name] || PRIORITY_COLORS[item.name?.toLowerCase?.()] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
  }))
  const hasData = formattedData.some((item) => item.value > 0)

  return (
    <div style={{
      background: "linear-gradient(145deg, #1a0010 0%, #2d0a1a 60%, #1a0010 100%)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(255,45,85,0.2)",
      boxShadow: "0 20px 60px rgba(255,45,85,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
      width: "100%",
      height: "320px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Flame glow */}
      <div style={{
        position: "absolute", bottom: -30, left: "50%", transform: "translateX(-50%)",
        width: 200, height: 120,
        background: "radial-gradient(ellipse, rgba(255,107,43,0.2) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>🐛</span>
        <h3 style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#FF6B2B",
          fontFamily: "'DM Mono', monospace"
        }}>
          Bugs By Priority
        </h3>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="48%"
              outerRadius={88}
              innerRadius={44}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              stroke="none"
            >
              {formattedData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: "#ccc", fontSize: 11, fontFamily: "DM Mono, monospace" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{
          height: "85%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: 12,
          fontFamily: "DM Mono, monospace",
          letterSpacing: "0.08em",
          textTransform: "uppercase"
        }}>
          No bug priority data
        </div>
      )}
    </div>
  )
}

export default BugsPriorityChart
