// Home.jsx — Redesigned CyberShield Home Page
// Fully modern, cyberpunk-inspired, responsive dashboard-style homepage
// Uses: TailwindCSS, Framer Motion, Lucide Icons
// Drop this into: src/pages/Home.jsx or wherever your home route points

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  BookOpen,
  Bug,
  MailSearch,
  ArrowRight,
  Radio,
  BrainCircuit,
  CalendarDays,
} from "lucide-react";

export default function Home() {
  const [threatCount, setThreatCount] = useState(0);
  const [breachCount, setBreachCount] = useState(0);
  const [cveCount, setCveCount] = useState(0);

  // Fake auto-update counters (replace with your live APIs)
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount((t) => t + Math.floor(Math.random() * 5));
      setBreachCount((b) => b + Math.floor(Math.random() * 2));
      setCveCount((c) => c + Math.floor(Math.random() * 3));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6 md:p-10">
      {/* HERO SECTION */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        <div className="flex justify-center mb-4">
          <Shield className="h-16 w-16 text-cyan-400 drop-shadow-lg" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">
          Welcome to <span className="text-cyan-400">CyberShield</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Real-time threat intelligence, breach detection, cyber learning & smart
automation — all in one unified security dashboard.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            to="/learning"
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold flex items-center gap-2"
          >
            Start Learning <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/breaches"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold flex items-center gap-2"
          >
            Scan Email <MailSearch className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* LIVE STATS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6"
      >
        <StatCard
          icon={<Activity className="h-8 w-8 text-red-400" />}
          title="Live Threats Today"
          value={threatCount}
          gradient="from-red-600/30 to-red-800/30"
        />

        <StatCard
          icon={<Bug className="h-8 w-8 text-yellow-400" />}
          title="Breaches Reported"
          value={breachCount}
          gradient="from-yellow-600/30 to-yellow-800/30"
        />

        <StatCard
          icon={<Radio className="h-8 w-8 text-purple-400" />}
          title="New CVEs Today"
          value={cveCount}
          gradient="from-purple-600/30 to-purple-800/30"
        />
      </motion.div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-5xl mx-auto mt-16 grid md:grid-cols-4 gap-6"
      >
        <ActionCard
          title="Learning Hub"
          icon={<BookOpen className="h-9 w-9 text-cyan-400" />}
          to="/learning"
          desc="Interactive lessons, quizzes & simulations"
        />

        <ActionCard
          title="Breach Detector"
          icon={<MailSearch className="h-9 w-9 text-emerald-400" />}
          to="/breaches"
          desc="Check if your email was exposed"
        />

        <ActionCard
          title="Threat Intel"
          icon={<BrainCircuit className="h-9 w-9 text-yellow-400" />}
          to="/threats"
          desc="Live cyber threat feeds & indicators"
        />

        <ActionCard
          title="News Feed"
          icon={<CalendarDays className="h-9 w-9 text-pink-400" />}
          to="/news"
          desc="Latest cybersecurity updates"
        />
      </motion.div>

      {/* LEARNING SECTION HIGHLIGHT */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-5xl mx-auto mt-20 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-10 border border-cyan-700/40"
      >
        <h2 className="text-3xl font-bold text-cyan-300 mb-3">Continue Learning</h2>
        <p className="text-gray-300 mb-6">
          Short lessons ● Interactive quizzes ● Real-world simulations
        </p>

        <Link
          to="/learning"
          className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold"
        >
          Go to Learning Center <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* NEWS PREVIEW (STATIC, replace with real data) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-5xl mx-auto mt-20"
      >
        <h2 className="text-3xl font-bold text-pink-300 mb-6">Top Cyber News</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <NewsCard
            title="Major Supply-Chain Attack Detected"
            source="CyberDaily"
          />
          <NewsCard
            title="New Ransomware Variant Spreading Rapidly"
            source="SecurityWire"
          />
          <NewsCard
            title="0-Day Vulnerability Found in Popular App"
            source="ThreatWatch"
          />
        </div>

        <div className="text-center mt-6">
          <Link
            to="/news"
            className="px-6 py-3 bg-pink-600 hover:bg-pink-500 rounded-xl font-semibold inline-flex items-center gap-2"
          >
            View All News <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <div className="h-20" />
    </div>
  );
}

/* ------------------ COMPONENTS ------------------ */
function StatCard({ icon, title, value, gradient }) {
  return (
    <div
      className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 shadow-xl`}
    >
      <div className="flex items-center gap-3 mb-3">{icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
        {value}
      </div>
    </div>
  );
}

function ActionCard({ title, icon, desc, to }) {
  return (
    <Link
      to={to}
      className="p-6 rounded-2xl bg-gray-900/50 border border-white/5 hover:bg-gray-800 transition block shadow-lg"
    >
      <div className="flex items-center gap-3 mb-2">{icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm">{desc}</p>
    </Link>
  );
}

function NewsCard({ title, source }) {
  return (
    <div className="p-6 bg-gray-900/50 rounded-2xl border border-white/5 shadow-md hover:bg-gray-800 transition h-full">
      <h3 className="font-semibold mb-2 text-white">{title}</h3>
      <p className="text-xs text-gray-400 mb-4">Source: {source}</p>
      <button className="text-sm text-pink-400 hover:text-pink-300 inline-flex items-center gap-1">
        Read More <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
