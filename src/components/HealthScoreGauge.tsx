"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./HealthScoreGauge.module.css";

interface HealthScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}

export default function HealthScoreGauge({
    score,
    size = 180,
    strokeWidth = 12,
    label = "Health Score",
}: HealthScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 70) return "#4ade80"; // success
        if (s >= 40) return "#fbbf24"; // warning
        return "#f87171"; // danger
    };

    const getLabel = (s: number) => {
        if (s >= 70) return "Optimized";
        if (s >= 40) return "At Risk";
        return "Critical";
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 300);
        return () => clearTimeout(timer);
    }, [score]);

    const color = getColor(score);

    return (
        <div className={styles.wrapper} ref={ref}>
            <svg width={size} height={size} className={styles.svg}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={strokeWidth}
                />
                {/* Score circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={styles.scoreCircle}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color}50)`,
                    }}
                />
            </svg>
            <div className={styles.center}>
                <span className={styles.score} style={{ color }}>
                    {animatedScore}
                </span>
                <span className={styles.label}>{label}</span>
                <span className={styles.status} style={{ color }}>
                    {getLabel(score)}
                </span>
            </div>
        </div>
    );
}
