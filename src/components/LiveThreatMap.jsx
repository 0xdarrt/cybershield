import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LiveThreatMap = () => {
    const [attacks, setAttacks] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const id = Date.now();
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const endX = Math.random() * 100;
            const endY = Math.random() * 100;

            setAttacks(prev => [...prev, { id, startX, startY, endX, endY }].slice(-10));
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-96 bg-[#0a0a0a] border border-primary/20 rounded-lg overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* World Map Silhouette (Simplified) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain filter invert" />

            {/* Attacks */}
            {attacks.map(attack => (
                <React.Fragment key={attack.id}>
                    {/* Source Ping */}
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute w-2 h-2 bg-red-500 rounded-full"
                        style={{ left: `${attack.startX}%`, top: `${attack.startY}%` }}
                    />

                    {/* Projectile */}
                    <motion.div
                        initial={{ left: `${attack.startX}%`, top: `${attack.startY}%`, opacity: 1 }}
                        animate={{ left: `${attack.endX}%`, top: `${attack.endY}%`, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="absolute w-1 h-1 bg-white shadow-[0_0_10px_#fff] rounded-full z-10"
                    />

                    {/* Trajectory Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <motion.line
                            x1={`${attack.startX}%`}
                            y1={`${attack.startY}%`}
                            x2={`${attack.endX}%`}
                            y2={`${attack.endY}%`}
                            stroke="rgba(255, 0, 60, 0.5)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                        />
                    </svg>
                </React.Fragment>
            ))}

            <div className="absolute bottom-4 left-4 bg-black/80 p-2 border border-primary/30 rounded text-xs font-mono text-primary">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    LIVE ATTACK FEED
                </div>
            </div>
        </div>
    );
};

export default LiveThreatMap;
