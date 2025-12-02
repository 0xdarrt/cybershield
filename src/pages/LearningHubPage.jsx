import React from 'react';
import { Shield, Lock, Smartphone, Mail, ChevronDown } from 'lucide-react';
import QuizComponent from '../components/QuizComponent';

const TOPICS = [
    {
        id: 1,
        title: "Phishing Attacks",
        icon: <Mail className="h-6 w-6 text-yellow-500" />,
        content: "Phishing is a cybercrime in which a target or targets are contacted by email, telephone or text message by someone posing as a legitimate institution to lure individuals into providing sensitive data such as personally identifiable information, banking and credit card details, and passwords."
    },
    {
        id: 2,
        title: "Ransomware",
        icon: <Lock className="h-6 w-6 text-red-500" />,
        content: "Ransomware is a type of malware from cryptovirology that threatens to publish the victim's data or perpetually block access to it unless a ransom is paid."
    },
    {
        id: 3,
        title: "Two-Factor Authentication (2FA)",
        icon: <Smartphone className="h-6 w-6 text-blue-500" />,
        content: "Multi-factor authentication is an electronic authentication method in which a computer user is granted access to a website or application only after successfully presenting two or more pieces of evidence to an authentication mechanism."
    },
    {
        id: 4,
        title: "Zero-Day Vulnerabilities",
        icon: <Shield className="h-6 w-6 text-purple-500" />,
        content: "A zero-day vulnerability is a computer-software vulnerability that is unknown to those who should be interested in mitigating the vulnerability (including the vendor of the target software)."
    }
];

const LearningHubPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Cybersecurity Learning Hub</h1>
                <p className="text-muted-foreground text-lg">Master the basics of digital self-defense.</p>
            </div>

            <div className="grid gap-6">
                {TOPICS.map((topic) => (
                    <div key={topic.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-accent/10 rounded-lg">
                                {topic.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {topic.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10 pt-12">
                <h2 className="text-3xl font-display font-bold text-center mb-8 text-white">
                    <span className="text-accent">CYBER_IQ</span> ASSESSMENT
                </h2>
                <QuizComponent />
            </div>
        </div>
    );
};

export default LearningHubPage;
