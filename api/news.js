export default async function handler(req, res) {
    const API_KEY = process.env.VITE_NEWS_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'Server missing API Key' });
    }

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=cybersecurity OR malware OR ransomware OR "data breach"&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.message || 'API Error' });
        }

        // Cache control (optional but good for free tier limits)
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
}
