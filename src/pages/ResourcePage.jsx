import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Tag, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourcePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [article, setArticle] = useState(location.state?.article || null);

    useEffect(() => {
        // If no state (e.g., refresh), try to load from localStorage
        if (!article) {
            const cached = localStorage.getItem('current_resource');
            if (cached) {
                try {
                    setArticle(JSON.parse(cached));
                } catch (e) {
                    console.error("Failed to parse cached resource");
                }
            }
        }
    }, [article]);

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <h2 className="text-2xl font-display font-bold text-primary">Resource Not Found</h2>
                <p className="text-muted">The requested intelligence report could not be loaded.</p>
                <button onClick={() => navigate('/news')} className="btn-cyber">
                    Return to Feed
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-8 pb-12"
        >
            {/* Navigation */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-primary hover:text-white transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                BACK_TO_INTEL
            </button>

            {/* Header */}
            <header className="space-y-6 border-b border-white/10 pb-8">
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-xs font-mono uppercase">
                        {article.source?.name || 'Unknown Source'}
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded text-xs font-mono uppercase">
                        CRITICAL_INTEL
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight text-white text-glow">
                    {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted font-mono">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </div>
                    {article.author && (
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {article.author}
                        </div>
                    )}
                </div>
            </header>

            {/* Featured Image */}
            {article.urlToImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-neon-blue/20 group">
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
            )}

            {/* Content Body */}
            <article className="prose prose-invert prose-lg max-w-none">
                <p className="lead text-xl text-white/90 leading-relaxed font-light border-l-4 border-primary pl-6 italic">
                    {article.description}
                </p>

                <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
                    {/* Simulating full content since API usually truncates */}
                    <p>
                        {article.content ? article.content.split('[')[0] : article.description}
                    </p>

                    <div className="bg-surface border border-white/10 p-6 rounded-lg my-8">
                        <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent" />
                            THREAT ANALYSIS
                        </h3>
                        <p className="text-sm font-mono text-muted">
                            This incident represents a significant escalation in cyber activity.
                            Security teams are advised to verify their patch levels immediately.
                            Indicators of Compromise (IoCs) suggest involvement of advanced persistent threat (APT) groups.
                        </p>
                    </div>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
            </article>

            {/* Actions */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <div className="flex gap-2">
                    <button className="btn-cyber flex items-center gap-2 text-sm">
                        <Share2 className="w-4 h-4" /> SHARE_INTEL
                    </button>
                </div>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-white transition-colors font-mono text-sm flex items-center gap-2"
                >
                    ORIGINAL_SOURCE <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </motion.div>
    );
};

export default ResourcePage;
