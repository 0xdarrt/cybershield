import { useEffect, useState } from "react";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNews() {
    try {
      const response = await fetch("/api/fetchNews");
      const json = await response.json();
      setNews(json.articles || []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading news:", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="news-container">
      <h1>Cybersecurity News</h1>

      {news.length === 0 && <p>No news available.</p>}

      {news.map((item, index) => (
        <div key={index} className="news-card">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <a href={item.url} target="_blank">Read full article →</a>
        </div>
      ))}
    </div>
  );
}
