import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPA_URL, process.env.SUPA_KEY);

  const api = `https://gnews.io/api/v4/search?q=cybersecurity&max=10&token=${process.env.GNEWS_KEY}`;
  const news = await fetch(api).then(r => r.json());

  for (const a of news.articles) {
    await supabase.from("news").upsert({
      title: a.title,
      url: a.url,
      published_at: a.publishedAt
    }, { onConflict: "url" });
  }

  res.json({ status: "done" });
}
