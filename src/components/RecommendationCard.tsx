"use client";

import { Lightbulb } from "lucide-react";
import styles from "./RecommendationCard.module.css";

interface RecommendationCardProps {
    text: string;
    index: number;
}

export default function RecommendationCard({ text, index }: RecommendationCardProps) {
    return (
        <div className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
            <div className={styles.iconWrap}>
                <Lightbulb size={18} />
            </div>
            <p className={styles.text}>{text}</p>
        </div>
    );
}
