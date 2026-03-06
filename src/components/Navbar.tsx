"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Activity, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                <Link href="/" className={styles.brand}>
                    <div className={styles.logoIcon}>
                        <Activity size={22} />
                    </div>
                    <span className={styles.logoText}>
                        Repo<span className={styles.logoAccent}>Pulse</span>
                    </span>
                </Link>

                <div className={`${styles.navLinks} ${mobileOpen ? styles.open : ""}`}>
                    <Link href="/" className={styles.navLink} onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link href="/dashboard" className={styles.navLink} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                    <Link href="/#features" className={styles.navLink} onClick={() => setMobileOpen(false)}>Features</Link>
                    <Link href="/#how-it-works" className={styles.navLink} onClick={() => setMobileOpen(false)}>How it Works</Link>
                </div>

                <div className={styles.actions}>
                    <Link href="/dashboard" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.85rem" }}>
                        Get Started
                    </Link>
                </div>

                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
