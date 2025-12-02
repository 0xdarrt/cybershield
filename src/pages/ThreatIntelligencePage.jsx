import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { ShieldAlert, Globe, Activity, Zap } from 'lucide-react';
import LiveThreatMap from '../components/LiveThreatMap';

const THREAT_DATA = [
    { name: 'Mon', attacks: 4000, blocked: 2400 },
    { name: 'Tue', attacks: 3000, blocked: 1398 },
    { name: 'Wed', attacks: 2000, blocked: 9800 },
    { name: 'Thu', attacks: 2780, blocked: 3908 },
    { name: 'Fri', attacks: 1890, blocked: 4800 },
    { name: 'Sat', attacks: 2390, blocked: 3800 },
    { name: 'Sun', attacks: 3490, blocked: 4300 },
];

const ATTACK_TYPES = [
    { name: 'Phishing', value: 400 },
    { name: 'DDoS', value: 300 },
    { name: 'Malware', value: 300 },
    { name: 'Ransomware', value: 200 },
];

const ThreatIntelligencePage = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Global Threat Intelligence</h1>
                    <p className="text-muted">Real-time telemetry from 500+ sensors worldwide.</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-mono text-sm">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    SYSTEM ONLINE
                </div>
            </div>

            {/* Live Map Section */}
            <div className="card-cyber p-1 rounded-xl">
                <LiveThreatMap />
            </div>

            {/* KPI Grid */}
            <div className="grid md:grid-cols-4 gap-4">
                <div className="card-cyber p-4">
                    <div className="flex items-center gap-2 mb-2 text-accent">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider">ATTACKS / SEC</span>
                    </div>
                    <div className="text-2xl font-mono font-bold">2,491</div>
                </div>
                <div className="card-cyber p-4">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <ShieldAlert className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider">THREATS BLOCKED</span>
                    </div>
                    <div className="text-2xl font-mono font-bold">14.2M</div>
                </div>
                <div className="card-cyber p-4">
                    <div className="flex items-center gap-2 mb-2 text-secondary">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider">ACTIVE BOTNETS</span>
                    </div>
                    <div className="text-2xl font-mono font-bold">89</div>
                </div>
                <div className="card-cyber p-4">
                    <div className="flex items-center gap-2 mb-2 text-warning">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider">CVE COUNT (24H)</span>
                    </div>
                    <div className="text-2xl font-mono font-bold">12</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="card-cyber p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-6 text-white">Weekly Attack Traffic</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={THREAT_DATA}>
                                <defs>
                                    <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#525252" />
                                <YAxis stroke="#525252" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="attacks" stroke="#ff003c" fillOpacity={1} fill="url(#colorAttacks)" />
                                <Area type="monotone" dataKey="blocked" stroke="#00ff41" fillOpacity={1} fill="url(#colorBlocked)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-cyber p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-6 text-white">Top Attack Vectors</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ATTACK_TYPES} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="#525252" />
                                <YAxis dataKey="name" type="category" stroke="#525252" width={100} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#00b8ff" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatIntelligencePage;
