import fetch from "node-fetch";

export default async function handler(req, res) {
  const email = req.query.email;

  // 1) Free HIBP public endpoint
  const hibp = await fetch(
    `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
    { headers: { "User-Agent": "mycyberapp" } }
  );

  let breaches = [];
  if (hibp.status === 200) {
    breaches = await hibp.json();
  }

  // 2) Basic profile via Gravatar
  const crypto = await import("crypto");
  const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
  const gravatarUrl = `https://www.gravatar.com/${hash}.json`;

  let profile = null;
  try {
    profile = await fetch(gravatarUrl).then(r => r.json());
  } catch {}

  res.json({
    email,
    breaches,
    profile
  });
}
