import { useEffect, useState } from "react";
import { fetchCyberNews } from "../services/NewsService";
import "./NewsPage.css";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalArticle, setModalArticle] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadNews = async () => {
    setLoading(true);
    try {
      const articles = await fetchCyberNews();
      setNews(articles);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching news:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(); // first load
    const interval = setInterval(loadNews, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const openModal = (article) => setModalArticle(article);
  const closeModal = () => setModalArticle(null);

  if (loading) return <p>Loading news...</p>;

  return (
    <div className="news-container">
      <h1>Cybersecurity News</h1>
      {lastUpdated && <p className="last-updated">Last updated: {lastUpdated}</p>}

      {news.length === 0 && <p>No news available.</p>}

      <div className="news-grid">
        {news.map((item, index) => (
          <div key={index} className="news-card">
            {item.urlToImage && <img src={item.urlToImage} alt={item.title} />}
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button className="read-more" onClick={() => openModal(item)}>
              Read Full Article →
            </button>
          </div>
        ))}
      </div>

      {modalArticle && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalArticle.title}</h2>
            {modalArticle.urlToImage && (
              <img src={modalArticle.urlToImage} alt={modalArticle.title} />
            )}
            <p>{modalArticle.content || modalArticle.description}</p>
            <iframe
              src={modalArticle.url}
              style={{ width: "100%", height: "70vh", border: "none" }}
            />
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
