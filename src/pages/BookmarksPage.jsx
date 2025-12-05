import React, { useEffect, useState } from "react";

export default function BookmarksPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cybershield_bookmarks") || "[]");
    setItems(saved);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-cyan-300 mb-6">Bookmarks</h1>

        {items.length === 0 ? (
          <p className="text-gray-400">You have no bookmarks saved yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-700 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>

                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm">
                    Open →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
