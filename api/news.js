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
