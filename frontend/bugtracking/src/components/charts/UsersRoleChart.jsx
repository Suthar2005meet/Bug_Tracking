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
    <div style={{
      background: "linear-gradient(145deg, #001a0e 0%, #002a1a 60%, #001a0e 100%)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(16,185,129,0.18)",
      boxShadow: "0 20px 60px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
      width: "100%",
      height: "320px",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      {/* Center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "38%",
        transform: "translate(-50%,-50%)",
        width: 160, height: 160, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
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

      <div style={{ display: "flex", alignItems: "center", height: "calc(100% - 52px)" }}>
        {/* Donut */}
        <div style={{ width: "55%", height: "100%", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={84}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
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

        {/* Legend + stats */}
        <div style={{ width: "45%", paddingLeft: 12, display: "flex", flexDirection: "column", gap: 7 }}>
          {formattedData.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              padding: "5px 10px",
              border: `1px solid ${item.color}22`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                <span style={{ color: "#cbd5e1", fontSize: 11, fontFamily: "DM Mono, monospace" }}>{item.name}</span>
              </div>
              <span style={{ color: item.color, fontSize: 12, fontWeight: 700, fontFamily: "DM Mono, monospace" }}>
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
