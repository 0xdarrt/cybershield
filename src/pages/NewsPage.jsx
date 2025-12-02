import React, { useState, useEffect } from 'react';
import { Search, Filter, Bookmark, RefreshCw, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fetchCyberNews } from '../services/NewsService';

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    const loadNews = async () => {
        setLoading(true);
        const data = await fetchCyberNews();
        setNews(data);
        setLoading(false);
    };

    useEffect(() => {
        loadNews();
        // Auto-refresh every 60 seconds
        const interval = setInterval(loadNews, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleArticleClick = (article) => {
        // Navigate to resource page with article data in state
        // Using title as ID for URL (slugified)
        const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Cache for persistence on refresh
        localStorage.setItem('current_resource', JSON.stringify(article));

        navigate(`/resource/${slug}`, { state: { article } });
    };

    const filteredNews = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        // Simple mock category filtering since API doesn't always provide tags
        const matchesFilter = filter === 'All' ||
            (item.title + item.description).toLowerCase().includes(filter.toLowerCase());
        return matchesSearch && matchesFilter;
    });

    const categories = ['All', 'Malware', 'Ransomware', 'Data Breach', 'Vulnerability'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Cyber Intelligence Feed</h1>
                    <div className="flex items-center gap-2 text-primary text-sm font-mono">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        LIVE_STREAM_ACTIVE
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-4 w-4" />
                        <input
                            type="text"
                            placeholder="SEARCH_INTEL..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded focus:outline-none focus:border-primary focus:shadow-neon-green text-sm font-mono transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={loadNews}
                        className="p-2 border border-white/10 rounded hover:bg-white/5 text-primary transition-colors"
                        title="Refresh Feed"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded text-sm font-mono font-bold uppercase tracking-wider transition-all border ${filter === cat
                            ? 'bg-primary text-black border-primary shadow-neon-green'
                            : 'bg-black/50 text-muted border-white/10 hover:border-primary/50 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* News Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-64 bg-surface border border-white/10 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredNews.map((item, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleArticleClick(item)}
                            className="card-cyber p-0 group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative h-48 overflow-hidden border-b border-white/10">
                                {item.urlToImage ? (
                                    <img
                                        src={item.urlToImage}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-surface flex items-center justify-center text-muted">
                                        NO_IMAGE_DATA
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 bg-black/80 backdrop-blur text-primary text-xs font-mono border border-primary/30 rounded">
                                        {item.source.name}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs text-muted font-mono">
                                        {new Date(item.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h2>

                                <p className="text-muted text-sm mb-4 line-clamp-3 flex-grow">
                                    {item.description}
                                </p>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                    <span className="text-xs font-mono text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        READ_FULL_REPORT <ExternalLink className="w-3 h-3" />
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); /* Add bookmark logic */ }}
                                        className="text-muted hover:text-primary transition-colors"
                                    >
                                        <Bookmark className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsPage;
