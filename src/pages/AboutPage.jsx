import React from 'react';
import { Shield, Github, Twitter, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="max-w-3xl mx-auto py-12 space-y-12">
            <section className="text-center space-y-6">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <Shield className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl font-bold">About CyberShield</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    CyberShield is an open-source threat intelligence hub designed to keep security professionals and everyday users ahead of the curve.
                </p>
            </section>

            <section className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="text-muted-foreground">
                    In an era of increasing digital threats, information is your best defense. We aggregate real-time data from trusted sources to provide a comprehensive view of the global threat landscape.
                </p>

                <div className="grid md:grid-cols-3 gap-6 pt-4">
                    <div className="text-center p-4">
                        <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                        <div className="text-sm text-muted-foreground">Monitoring</div>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-3xl font-bold text-accent mb-2">100+</div>
                        <div className="text-sm text-muted-foreground">Data Sources</div>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-3xl font-bold text-green-500 mb-2">Free</div>
                        <div className="text-sm text-muted-foreground">For Everyone</div>
                    </div>
                </div>
            </section>

            <section className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Connect With Us</h2>
                <div className="flex justify-center gap-6">
                    <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Github className="h-5 w-5" /> GitHub
                    </a>
                    <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-5 w-5" /> Twitter
                    </a>
                    <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-5 w-5" /> Contact
                    </a>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
