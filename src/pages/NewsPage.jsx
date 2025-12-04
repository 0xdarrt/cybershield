import { useEffect, useState } from "react";
import "./News.css"; // CSS file we will create next

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalArticle, setModalArticle] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch live news from API
  async function loadNews() {
    try {
      const response = await fetch("/api/fetchNews");
      const json = await response.json();
      setNews(json.articles || []);
      setLoading(false);

      // Save articles for modal lookup
      localStorage.setItem("newsData", JSON.stringify(json.articles || []));

      // Update last refreshed time
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error loading news:", err);
      setLoading(false);
    }
  }

  // Initial load + auto-refresh every 5 minutes
  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 300000); // 300000ms = 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Open modal for full article
  const openModal = (article) => {
    setModalArticle(article);
  };

  // Close modal
  const closeModal = () => {
    setModalArticle(null);
  };

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="news-container">
      <h1>Cybersecurity News</h1>
      {lastUpdated && <p className="last-updated">Last updated: {lastUpdated}</p>}

      {news.length === 0 && <p>No news available.</p>}

      <div className="news-grid">
        {news.map((item, index) => (
          <div key={index} className="news-card">
            {item.image && <img src={item.image} alt={item.title} />}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="read-more" onClick={() => openModal(item)}>
              Read Full Article →
            </button>
          </div>
        ))}
      </div>

      {/* Modal for full article */}
      {modalArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalArticle.title}</h2>
            {modalArticle.image && (
              <img src={modalArticle.image} alt={modalArticle.title} />
            )}
            <p>{modalArticle.description}</p>
            <iframe
              src={modalArticle.url}
              style={{ width: "100%", height: "70vh", border: "none" }}
            ></iframe>
            <button onClick={closeModal} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
