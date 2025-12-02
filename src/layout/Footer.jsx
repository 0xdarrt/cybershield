import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-border/40 bg-background py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">
                            Cyber<span className="text-primary">Shield</span>
                        </span>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
                        © {new Date().getFullYear()} CyberShield. All rights reserved.
                        <br />
                        Stay safe, stay informed.
                    </div>

                    <div className="flex space-x-4">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
