"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

interface PRBreakdownChartProps {
    mergedPRs: number;
    unmergedClosedPRs: number;
    stalePRs: number;
    openPRs: number;
}

const COLORS = ["#4ade80", "#f87171", "#fbbf24", "#60a5fa"]; // success, danger, warning, info

export default function PRBreakdownChart({
    mergedPRs,
    unmergedClosedPRs,
    stalePRs,
    openPRs,
}: PRBreakdownChartProps) {
    const data = [
        { name: "Merged", value: mergedPRs },
        { name: "Unmerged Closed", value: unmergedClosedPRs },
        { name: "Stale", value: stalePRs },
        { name: "Open", value: openPRs },
    ].filter((d) => d.value > 0);

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        strokeWidth={0}
                        animationBegin={200}
                        animationDuration={1000}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                style={{
                                    filter: `drop-shadow(0 0 12px ${COLORS[index % COLORS.length]}20)`,
                                }}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: "#161618",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "8px",
                            color: "#fafafa",
                            fontSize: "0.8rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{ padding: "0px" }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value: string) => (
                            <span style={{ color: "#a1a1aa", fontSize: "0.75rem", fontWeight: 500, fontFamily: "var(--font-mono)" }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
