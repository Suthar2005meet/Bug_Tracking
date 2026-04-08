import React from "react"

const STATUS_CONFIG = {
  Open:       { color: "#FF453A", emoji: "🔴" },
  "In Progress": { color: "#FF9F0A", emoji: "🟡" },
  Resolved:   { color: "#32D74B", emoji: "🟢" },
  Closed:     { color: "#636366", emoji: "⚫" },
  Reopened:   { color: "#BF5AF2", emoji: "🟣" },
  Unknown:    { color: "#48484A", emoji: "⚪" },
}

const FALLBACK_COLORS = ["#FF453A", "#FF9F0A", "#32D74B", "#0A84FF", "#BF5AF2", "#636366"]

const BugsStatusChart = ({ data = [] }) => {
  const formattedData = data.map((item, i) => ({
    name: item._id || "Unknown",
    value: item.count || 0,
    config: STATUS_CONFIG[item._id] || { color: FALLBACK_COLORS[i % FALLBACK_COLORS.length], emoji: "•" }
  }))

  const total = formattedData.reduce((sum, d) => sum + d.value, 0)
  const sorted = [...formattedData].sort((a, b) => b.value - a.value)

  return (
    <div style={{
      background: "linear-gradient(160deg, #0a0a0f 0%, #111827 100%)",
      borderRadius: "20px",
      padding: "24px",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      width: "100%",
      height: "320px",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box"
    }}>
      {/* Grid lines background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🐛</span>
          <h3 style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#94a3b8",
            fontFamily: "'DM Mono', monospace"
          }}>Bugs By Status</h3>
        </div>
        <span style={{
          background: "rgba(255,69,58,0.15)",
          color: "#FF453A",
          borderRadius: 8,
          padding: "2px 10px",
          fontSize: 12,
          fontFamily: "DM Mono, monospace",
          fontWeight: 700,
          border: "1px solid rgba(255,69,58,0.25)"
        }}>Total: {total}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", maxHeight: 230 }}>
        {sorted.map((item, i) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0
          return (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: "#e2e8f0", fontSize: 12,
                  fontFamily: "DM Mono, monospace"
                }}>
                  <span>{item.config.emoji}</span>
                  {item.name}
                </span>
                <span style={{ color: item.config.color, fontSize: 12, fontWeight: 700, fontFamily: "DM Mono, monospace" }}>
                  {item.value} <span style={{ color: "#475569", fontWeight: 400 }}>({pct.toFixed(0)}%)</span>
                </span>
              </div>
              <div style={{
                height: 7, borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 10,
                  background: `linear-gradient(90deg, ${item.config.color}99, ${item.config.color})`,
                  transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
                  boxShadow: `0 0 10px ${item.config.color}55`
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BugsStatusChart