import Link from "next/link";
import { Activity, Github, Twitter, Linkedin, Mail } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.gradientLine} />
            <div className={styles.inner}>
                <div className={styles.grid}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <div className={styles.brand}>
                            <div className={styles.logoIcon}>
                                <Activity size={18} />
                            </div>
                            <span className={styles.logoText}>
                                Repo<span className={styles.logoAccent}>Pulse</span>
                            </span>
                        </div>
                        <p className={styles.brandDesc}>
                            AI-powered repository health intelligence. Keep your GitHub repos healthy and your team productive.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" aria-label="GitHub"><Github size={18} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                            <a href="#" aria-label="Email"><Mail size={18} /></a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Product</h4>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/#features">Features</Link>
                        <Link href="/#how-it-works">How it Works</Link>
                        <a href="#">Pricing</a>
                    </div>

                    {/* Resources */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Resources</h4>
                        <a href="#">Documentation</a>
                        <a href="#">API Reference</a>
                        <a href="#">Blog</a>
                        <a href="#">Changelog</a>
                    </div>

                    {/* Company */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} RepoPulse. All rights reserved.</p>
                    <p className={styles.madeWith}>
                        Made with 💜 for developers
                    </p>
                </div>
            </div>
        </footer>
    );
}
