import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Terminal, AlertTriangle, CheckCircle, Lock, User, Globe, Network, Cpu, Wifi, Share2, Trash2, Github, Code, Hash, Gitlab, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SmartBreachDetector = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => {
        setLogs(prev => [...prev, `> ${msg}`]);
    };

    // --- REAL-TIME RECON FUNCTIONS ---

    const validateDomain = async (domain) => {
        try {
            addLog(`Querying DNS records for @${domain}...`);
            const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
            const data = await res.json();

            if (data.Status === 0 && data.Answer) {
                const primaryMx = data.Answer.sort((a, b) => {
                    const prioA = parseInt(a.data.split(' ')[0]);
                    const prioB = parseInt(b.data.split(' ')[0]);
                    return prioA - prioB;
                })[0];

                const server = primaryMx.data.split(' ').pop().slice(0, -1);

                return {
                    valid: true,
                    server: server
                };
            }
            return { valid: false, server: 'NXDOMAIN' };
        } catch (e) {
            return { valid: false, server: 'Lookup Failed' };
        }
    };

    // --- EXPANDED SOCIAL RECON FUNCTIONS ---

    const checkGitHub = async (username) => {
        try {
            addLog(`Checking GitHub for user '${username}'...`);
            const res = await fetch(`https://api.github.com/users/${username}`);
            if (res.ok) {
                const data = await res.json();
                return { found: true, url: data.html_url, avatar: data.avatar_url, name: 'GitHub', icon: Github };
            }
            return { found: false };
        } catch (e) { return { found: false }; }
    };

    const checkGitLab = async (username) => {
        try {
            addLog(`Checking GitLab for user '${username}'...`);
            const res = await fetch(`https://gitlab.com/api/v4/users?username=${username}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    return { found: true, url: data[0].web_url, avatar: data[0].avatar_url, name: 'GitLab', icon: Gitlab };
                }
            }
            return { found: false };
        } catch (e) { return { found: false }; }
    };

    const checkDevTo = async (username) => {
        try {
            addLog(`Checking Dev.to for user '${username}'...`);
            const res = await fetch(`https://dev.to/api/users/by_username?url=${username}`);
            if (res.ok) {
                const data = await res.json();
                return { found: true, url: `https://dev.to/${username}`, avatar: data.profile_image, name: 'Dev.to', icon: Code };
            }
            return { found: false };
        } catch (e) { return { found: false }; }
    };

    const checkBitbucket = async (username) => {
        // Bitbucket API is tricky with CORS, often blocks. We'll try, but handle failure gracefully.
        try {
            addLog(`Checking Bitbucket for user '${username}'...`);
            const res = await fetch(`https://api.bitbucket.org/2.0/users/${username}`);
            if (res.ok) {
                const data = await res.json();
                return { found: true, url: data.links.html.href, avatar: data.links.avatar.href, name: 'Bitbucket', icon: Box };
            }
            return { found: false };
        } catch (e) { return { found: false }; }
    };

    const fetchSocialProfile = async (email) => {
        const username = email.split('@')[0];
        const profiles = [];
        let avatarUrl = null;

        // 1. Check Unavatar (Gravatar/Clearbit)
        try {
            addLog("Scanning global avatar registries...");
            const res = await fetch(`https://unavatar.io/${email}?json=true`);
            if (res.ok) {
                const data = await res.json();
                if (data.url && !data.url.includes("fallback")) {
                    avatarUrl = data.url;
                    profiles.push({ name: 'Gravatar', url: '#', found: true, icon: User });
                }
            }
        } catch (e) { }

        // 2. Parallel Platform Checks
        const [gh, gl, dev, bb] = await Promise.all([
            checkGitHub(username),
            checkGitLab(username),
            checkDevTo(username),
            checkBitbucket(username)
        ]);

        if (gh.found) { profiles.push(gh); if (!avatarUrl) avatarUrl = gh.avatar; }
        if (gl.found) { profiles.push(gl); if (!avatarUrl) avatarUrl = gl.avatar; }
        if (dev.found) { profiles.push(dev); if (!avatarUrl) avatarUrl = dev.avatar; }
        if (bb.found) { profiles.push(bb); }

        return {
            found: profiles.length > 0,
            url: avatarUrl,
            profiles: profiles
        };
    };

    const checkDisposable = async (email) => {
        try {
            addLog("Verifying email reputation (Debounce)...");
            const res = await fetch(`https://disposable.debounce.io/?email=${email}`);
            const data = await res.json();
            return {
                isDisposable: data.disposable === 'true',
                reason: data.disposable === 'true' ? 'Burner Domain Detected' : 'Valid Mail Provider'
            };
        } catch (e) {
            return { isDisposable: false, reason: 'Check Failed' };
        }
    };

    // --- XPOSEDORNOT INTEGRATION ---

    const fetchBreaches = async (email) => {
        try {
            addLog("Querying XposedOrNot Database...");
            const res = await fetch(`https://api.xposedornot.com/v1/check-email/${email}`);

            if (res.status === 404 || res.status === 500) return [];

            const data = await res.json();

            if (data.Breaches && Array.isArray(data.Breaches)) {
                return data.Breaches.map(b => {
                    const name = Array.isArray(b) ? b[0] : b;
                    return {
                        Name: name,
                        DataClasses: ["Email", "Password"],
                        Date: "Unknown"
                    };
                });
            }
            return [];
        } catch (e) {
            return [];
        }
    };

    const analyzeEmail = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('scanning');
        setLogs([]);
        setResult(null);

        const domain = email.split('@')[1];
        if (!domain) {
            addLog("ERROR: Invalid email format.");
            setStatus('idle');
            return;
        }

        // 1. Start Parallel Recon
        const [domainData, socialData, disposableData, breachData] = await Promise.all([
            validateDomain(domain),
            fetchSocialProfile(email),
            checkDisposable(email),
            fetchBreaches(email)
        ]);

        // 2. Simulate Processing Time
        await new Promise(r => setTimeout(r, 600));
        addLog("Aggregating intelligence...");

        // Risk Calculation
        let riskLevel = 'Safe';
        if (!domainData.valid) riskLevel = 'Invalid Domain';
        else if (disposableData.isDisposable) riskLevel = 'High Risk (Burner)';
        else if (breachData.length > 0) riskLevel = 'Critical';

        setResult({
            level: riskLevel,
            domain: domainData,
            social: socialData,
            disposable: disposableData,
            breaches: breachData
        });

        addLog("Analysis complete. Dossier generated.");
        setStatus('result');
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-surface border border-primary/30 rounded-lg overflow-hidden shadow-neon-green/10">

                {/* Terminal Header */}
                <div className="bg-black/50 p-3 border-b border-primary/20 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" />
                    <span className="text-xs font-mono text-primary/70">SOCIAL_ANALYZER_LITE_V8.0.exe</span>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-display font-bold text-white mb-2">Deep Identity Reconnaissance</h2>
                        <p className="text-muted text-sm">
                            Advanced OSINT: Network + Multi-Platform Social Enumeration + Breach Intelligence.
                        </p>
                    </div>

                    <form onSubmit={analyzeEmail} className="relative max-w-2xl mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ENTER_TARGET_IDENTITY"
                            className="w-full bg-black/50 border border-primary/30 rounded p-4 pl-12 font-mono text-primary focus:outline-none focus:border-primary focus:shadow-neon-green transition-all"
                            disabled={status === 'scanning'}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 w-5 h-5" />
                        <button
                            type="submit"
                            disabled={status === 'scanning'}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-primary/10 text-primary font-mono font-bold rounded hover:bg-primary hover:text-black transition-colors disabled:opacity-50"
                        >
                            {status === 'scanning' ? 'SCANNING...' : 'INITIATE'}
                        </button>
                    </form>

                    {/* Logs */}
                    <AnimatePresence>
                        {(status === 'scanning') && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                className="bg-black p-4 rounded border border-white/10 font-mono text-xs text-green-500/80 space-y-1 max-w-2xl mx-auto"
                            >
                                {logs.map((log, i) => <div key={i}>{log}</div>)}
                                <div className="animate-pulse">_</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Grid */}
                    {status === 'result' && result && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="grid md:grid-cols-3 gap-6"
                        >
                            {/* COL 1: NETWORK INTEL */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-accent font-bold font-display">
                                    <Wifi className="w-5 h-5 animate-pulse" /> TARGET_NETWORK
                                </div>

                                <div className="bg-black/40 p-4 rounded border border-white/10 space-y-3 h-full overflow-hidden">
                                    <div className="flex flex-col border-b border-white/5 pb-2">
                                        <span className="text-muted text-xs flex items-center gap-2 mb-1"><Globe className="w-3 h-3" /> MAIL_SERVER (MX)</span>
                                        <span className="text-primary font-mono text-xs truncate w-full" title={result.domain.server}>
                                            {result.domain.server}
                                        </span>
                                    </div>

                                    <div className="pt-2">
                                        <span className="text-muted text-xs block mb-1">DOMAIN_STATUS</span>
                                        {result.domain.valid ? (
                                            <div className="flex items-center gap-2 text-green-500 text-xs font-mono">
                                                <CheckCircle className="w-3 h-3" /> ACTIVE
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-500 text-xs font-mono">
                                                <AlertTriangle className="w-3 h-3" /> UNREACHABLE
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* COL 2: SOCIAL & IDENTITY */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-blue-400 font-bold font-display">
                                    <User className="w-5 h-5" /> SOCIAL_IDENTITY
                                </div>

                                <div className="bg-black/40 p-4 rounded border border-white/10 space-y-4 h-full">
                                    <div className="flex items-center gap-4">
                                        {result.social.found ? (
                                            <img src={result.social.url} alt="Profile" className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center">
                                                <User className="w-8 h-8 text-muted" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-white text-sm">
                                                {result.social.found ? "PROFILE_FOUND" : "ANONYMOUS"}
                                            </h4>
                                            <p className="text-xs text-muted">
                                                {result.social.found ? `${result.social.profiles.length} Accounts Detected` : "No public profile"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted flex items-center gap-2"><Share2 className="w-3 h-3" /> ACCOUNTS</span>
                                            <div className="flex gap-2">
                                                {result.social.profiles.map((p, i) => {
                                                    const Icon = p.icon || User;
                                                    return (
                                                        <a key={i} href={p.url} target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-colors" title={p.name}>
                                                            <Icon className="w-4 h-4" />
                                                        </a>
                                                    );
                                                })}
                                                {result.social.profiles.length === 0 && <span className="text-xs text-muted">-</span>}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-muted flex items-center gap-2"><Trash2 className="w-3 h-3" /> EMAIL_TYPE</span>
                                            <span className={`text-xs font-mono font-bold ${result.disposable.isDisposable ? 'text-red-500' : 'text-green-500'}`}>
                                                {result.disposable.isDisposable ? "DISPOSABLE" : "LEGITIMATE"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COL 3: BREACH DATA */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary font-bold font-display">
                                    <Lock className="w-5 h-5" /> XPOSED_BREACHES
                                </div>

                                <div className="bg-black/40 p-4 rounded border border-white/10 h-full max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
                                    {result.breaches.length > 0 ? (
                                        <div className="space-y-3">
                                            {result.breaches.map((breach, i) => (
                                                <div key={i} className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0">
                                                    <div>
                                                        <span className="text-white font-bold text-sm">{breach.Name}</span>
                                                        <div className="text-xs text-muted mt-1">
                                                            {breach.DataClasses.join(', ')}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-mono text-red-500">{breach.Date}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-70">
                                            <CheckCircle className="w-12 h-12 text-green-500" />
                                            <span className="text-green-500 font-bold">CLEAN RECORD</span>
                                            <p className="text-xs text-muted">No breaches found in XposedOrNot DB.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartBreachDetector;
