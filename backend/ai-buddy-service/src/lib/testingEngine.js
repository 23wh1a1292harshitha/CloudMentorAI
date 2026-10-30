export async function fetchMastery(authHeader) {
  const base = process.env.TESTING_ENGINE_URL || "http://localhost:4001";
  try {
    const res = await fetch(`${base}/tests/mastery`, {
      headers: { Authorization: authHeader },
    });
    if (!res.ok) {
      console.error("Testing Engine mastery error:", res.status, await res.text());
      return [];
    }
    const data = await res.json();
    return Array.isArray(data.mastery) ? data.mastery : [];
  } catch (err) {
    console.error("Testing Engine unreachable:", err.message);
    return [];
  }
}
