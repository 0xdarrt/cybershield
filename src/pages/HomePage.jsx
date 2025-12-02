import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Activity, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center py-20 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-fast" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-block px-4 py-1 mb-6 border border-primary/30 rounded-full bg-primary/5 text-primary font-mono text-sm">
                        <span className="animate-pulse mr-2">●</span>
                        SYSTEM_STATUS: ONLINE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight text-white">
                        STAY AHEAD OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">CYBER THREATS</span>
                    </h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        Real-time intelligence hub for security professionals. Monitor breaches, track zero-days, and analyze global threat vectors.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/news" className="btn-cyber flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Live Intel Feed
                        </Link>
                        <Link to="/breaches" className="px-6 py-2 font-mono font-bold uppercase tracking-wider border border-white/20 text-white hover:bg-white/5 transition-colors">
                            Scan Assets
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Threat Level Meter */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto bg-surface border border-accent/50 rounded-xl p-8 relative overflow-hidden shadow-neon-red/20"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-600" />

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-sm font-mono text-muted mb-1">GLOBAL_THREAT_DEFCON</h2>
                        <div className="text-4xl font-display font-black text-accent animate-pulse text-glow">CRITICAL</div>
                    </div>
                    <Shield className="w-16 h-16 text-accent/20" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-black/40 p-3 rounded border border-white/10">
                        <div className="text-xs text-muted font-mono">CVE_COUNT</div>
                        <div className="text-xl font-bold text-white">1,204</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded border border-white/10">
                        <div className="text-xs text-muted font-mono">ATTACKS/MIN</div>
                        <div className="text-xl font-bold text-white">45k</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded border border-white/10">
                        <div className="text-xs text-muted font-mono">STATUS</div>
                        <div className="text-xl font-bold text-accent">ELEVATED</div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Links Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <QuickLinkCard
                    to="/news"
                    icon={<Zap className="h-8 w-8 text-secondary" />}
                    title="Live News"
                    desc="Real-time updates on vulnerabilities and attacks."
                />
                <QuickLinkCard
                    to="/breaches"
                    icon={<AlertTriangle className="h-8 w-8 text-accent" />}
                    title="Breach Alerts"
                    desc="Search recent data leaks and verify your email."
                />
                <QuickLinkCard
                    to="/learn"
                    icon={<BookOpen className="h-8 w-8 text-primary" />}
                    title="Learning Hub"
                    desc="Master cyber hygiene and defense tactics."
                />
            </div>
        </div>
    );
};

const QuickLinkCard = ({ to, icon, title, desc }) => (
    <Link to={to} className="block group">
        <div className="card-cyber p-6 h-full">
            <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <h3 className="text-xl font-display font-bold mb-2 text-white group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{desc}</p>
        </div>
    </Link>
);

export default HomePage;
