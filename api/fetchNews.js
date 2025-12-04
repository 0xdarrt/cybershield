export default async function handler(req, res) {
  try {
    // GNews API URL
    const url = `https://gnews.io/api/v4/top-headlines?category=technology&apikey=${process.env.GNEWS_KEY}&lang=en&country=us`;

    // Native fetch (works on Vercel)
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch GNews API" });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      articles: data.articles || [],
    });

  } catch (err) {
    console.error("Serverless Error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}

