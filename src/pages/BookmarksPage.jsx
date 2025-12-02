import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';

const BookmarksPage = () => {
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        // Mock loading from local storage for now, or use the real hook if implemented
        // For this demo, we'll just show a placeholder state if empty
        const saved = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setBookmarks(saved);
    }, []);

    const removeBookmark = (id) => {
        const updated = bookmarks.filter(b => b.id !== id);
        setBookmarks(updated);
        localStorage.setItem('bookmarks', JSON.stringify(updated));
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bookmark className="fill-current text-primary" /> Saved Intel
            </h1>

            {bookmarks.length === 0 ? (
                <div className="text-center py-24 bg-card border border-border rounded-xl border-dashed">
                    <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h2 className="text-xl font-semibold text-muted-foreground">No saved items yet</h2>
                    <p className="text-sm text-muted-foreground/60 mt-2">Bookmark news articles to read them later.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookmarks.map(item => (
                        <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center group hover:border-primary transition-colors">
                            <div>
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <div className="text-sm text-muted-foreground flex gap-2">
                                    <span>{item.source}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href={item.url} className="p-2 hover:bg-accent/10 rounded-full transition-colors text-muted-foreground hover:text-primary">
                                    <ExternalLink className="h-5 w-5" />
                                </a>
                                <button
                                    onClick={() => removeBookmark(item.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-muted-foreground hover:text-red-500"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookmarksPage;
