import React from 'react';
import { AlertOctagon, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SmartBreachDetector from '../components/SmartBreachDetector';

const MOCK_BREACHES = [
    {
        id: 1,
        company: "TechCorp Inc.",
        date: "2025-11-15",
        leaked: "Emails, Passwords",
        severity: "High",
        description: "A misconfigured S3 bucket exposed over 1.5 million user records containing plain text passwords and emails.",
        url: "#"
    },
    {
        id: 2,
        company: "ShopFast",
        date: "2025-11-10",
        leaked: "Credit Cards",
        severity: "Critical",
        description: "Payment processor breach resulting in the theft of full credit card numbers and CVV codes for transactions made in Oct 2025.",
        url: "#"
    },
    {
        id: 3,
        company: "SocialNet",
        date: "2025-10-25",
        leaked: "Usernames, Phone #",
        severity: "Medium",
        description: "API vulnerability allowed scraping of public and private profile data including linked phone numbers.",
        url: "#"
    },
    {
        id: 4,
        company: "HealthPlus",
        date: "2025-10-12",
        leaked: "Medical Records",
        severity: "Critical",
        description: "Ransomware attack encrypted patient records. Attackers threaten to release sensitive medical history.",
        url: "#"
    },
    {
        id: 5,
        company: "GameStream",
        date: "2025-09-30",
        leaked: "Emails",
        severity: "Low",
        description: "Marketing database leak containing email addresses and newsletter preferences.",
        url: "#"
    },
];

const BreachAlertsPage = () => {
    const navigate = useNavigate();

    const handleRowClick = (breach) => {
        // Transform breach data to match the 'article' structure expected by ResourcePage
        const articleData = {
            title: `BREACH ALERT: ${breach.company}`,
            source: { name: 'Breach Monitor' },
            publishedAt: breach.date,
            description: breach.description,
            content: `
        Detailed Incident Report:
        
        Target: ${breach.company}
        Date Detected: ${breach.date}
        Severity: ${breach.severity}
        
        Compromised Data: ${breach.leaked}
        
        Analysis:
        ${breach.description}
        
        Recommended Actions:
        1. Change passwords immediately if you have an account with ${breach.company}.
        2. Enable 2FA on all related accounts.
        3. Monitor bank statements for suspicious activity.
      `,
            url: breach.url,
            urlToImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1470' // Generic hacker image
        };

        const slug = `breach-${breach.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        navigate(`/resource/${slug}`, { state: { article: articleData } });
    };

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                    <span className="text-accent">BREACH</span> DETECTION SYSTEM
                </h1>
                <p className="text-muted max-w-2xl mx-auto">
                    Advanced heuristic scanning of dark web data dumps and compromised assets.
                </p>
            </section>

            {/* Smart Detector */}
            <section className="flex justify-center">
                <SmartBreachDetector />
            </section>

            {/* Recent Breaches Table */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-primary animate-pulse" />
                    <h2 className="text-2xl font-display font-bold text-white">RECENT DATA LEAKS</h2>
                </div>

                <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 border-b border-white/10">
                            <tr>
                                <th className="p-4 font-mono text-primary text-sm">TARGET</th>
                                <th className="p-4 font-mono text-primary text-sm">DATE</th>
                                <th className="p-4 font-mono text-primary text-sm">DATA_TYPE</th>
                                <th className="p-4 font-mono text-primary text-sm">SEVERITY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_BREACHES.map((breach) => (
                                <tr
                                    key={breach.id}
                                    onClick={() => handleRowClick(breach)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4 font-bold text-white group-hover:text-primary transition-colors">{breach.company}</td>
                                    <td className="p-4 text-muted font-mono text-sm">{breach.date}</td>
                                    <td className="p-4 text-white/80">{breach.leaked}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${breach.severity === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                                                breach.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                                                    breach.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                                        'bg-green-500/20 text-green-500 border border-green-500/30'
                                            }`}>
                                            {breach.severity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default BreachAlertsPage;
