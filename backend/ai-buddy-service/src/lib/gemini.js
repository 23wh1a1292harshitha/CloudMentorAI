// Supports Groq (default), OpenRouter, or Gemini depending on which key is set in .env.
// Priority: GROQ_API_KEY → OPENROUTER_API_KEY → GEMINI_API_KEY

export async function askGemini(prompt) {
  if (process.env.GROQ_API_KEY) {
    return callGroq(prompt);
  }
  if (process.env.OPENROUTER_API_KEY) {
    return callOpenRouter(prompt);
  }
  if (process.env.GEMINI_API_KEY) {
    return callGemini(prompt);
  }
  return { error: "No AI API key found. Add GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY to .env." };
}

// --- Groq (free tier, fast) ---
async function callGroq(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Groq API error:", data);
    return { error: "Groq returned an error." };
  }

  const reply = data.choices?.[0]?.message?.content;
  if (!reply) return { error: "Groq returned an empty reply." };
  return { reply };
}

// --- OpenRouter (free models available) ---
async function callOpenRouter(prompt) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:4000",
      "X-Title": "CloudMentor AI",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("OpenRouter API error:", data);
    return { error: "OpenRouter returned an error." };
  }

  const reply = data.choices?.[0]?.message?.content;
  if (!reply) return { error: "OpenRouter returned an empty reply." };
  return { reply };
}

// --- Gemini (requires billing on most projects) ---
async function callGemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    console.error("Gemini API error:", data);
    return { error: "Gemini returned an error." };
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) return { error: "Gemini returned an empty reply." };
  return { reply };
}
