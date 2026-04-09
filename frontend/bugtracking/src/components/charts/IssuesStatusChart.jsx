import React from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
    } from "recharts"
import { normalizeChartSeries } from "../../utils/chartData"

    const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
        <div style={{
            background: "rgba(0,20,30,0.96)",
            border: "1px solid rgba(20,184,166,0.3)",
            borderRadius: 10,
            padding: "10px 16px",
            color: "#e2e8f0",
            fontSize: 13,
            fontFamily: "DM Mono, monospace"
        }}>
            <div style={{ fontWeight: 700, color: "#2dd4bf" }}>{label}</div>
            <div>Count: <b style={{ color: "#5eead4" }}>{payload[0].value}</b></div>
        </div>
        )
    }
    return null
    }

const IssuesStatusChart = ({ data = [] }) => {
    const formattedData = normalizeChartSeries(data).map(item => ({
        name: item.name || "Unknown",
        value: item.value || 0
    }))
    const hasData = formattedData.some((item) => item.value > 0)

    return (
        <div style={{
        background: "linear-gradient(145deg, #001a1a 0%, #002a2a 60%, #001a1a 100%)",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid rgba(20,184,166,0.18)",
        boxShadow: "0 20px 60px rgba(20,184,166,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
        width: "100%",
        height: "320px",
        position: "relative",
        overflow: "hidden"
        }}>
        {/* Scanline effect */}
        <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(20,184,166,0.02) 4px)",
            pointerEvents: "none"
        }} />
        {/* Glow top right */}
        <div style={{
            position: "absolute", top: -20, right: -20,
            width: 140, height: 140, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)",
            pointerEvents: "none"
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <h3 style={{
            margin: 0,
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#2dd4bf",
            fontFamily: "'DM Mono', monospace"
            }}>Issues By Status</h3>
        </div>

        {hasData ? (
            <ResponsiveContainer width="100%" height="82%">
                <AreaChart data={formattedData}>
                <defs>
                    <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.03} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(20,184,166,0.08)" strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Mono, monospace" }}
                    axisLine={false} tickLine={false}
                />
                <YAxis
                    tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Mono, monospace" }}
                    axisLine={false} tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(20,184,166,0.2)" }} />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    fill="url(#tealGrad)"
                    dot={{ fill: "#14b8a6", r: 5, strokeWidth: 2, stroke: "#001a1a" }}
                    activeDot={{ r: 7, fill: "#5eead4", stroke: "#001a1a", strokeWidth: 2 }}
                />
                </AreaChart>
            </ResponsiveContainer>
        ) : (
            <div style={{
                height: "82%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: 12,
                fontFamily: "DM Mono, monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase"
            }}>
                No issue data
            </div>
        )}
        </div>
    )
    }

    export default IssuesStatusChart
