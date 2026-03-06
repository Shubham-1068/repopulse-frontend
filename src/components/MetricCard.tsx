"use client";

import { LucideIcon } from "lucide-react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: number | string;
    color?: string;
    bgColor?: string;
}

export default function MetricCard({
    icon: Icon,
    label,
    value,
    color = "var(--color-info)",
    bgColor = "var(--color-info-dim)",
}: MetricCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrap} style={{ background: bgColor }}>
                <Icon size={20} style={{ color }} />
            </div>
            <div className={styles.info}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value} style={{ color }}>
                    {value}
                </span>
            </div>
        </div>
    );
}
