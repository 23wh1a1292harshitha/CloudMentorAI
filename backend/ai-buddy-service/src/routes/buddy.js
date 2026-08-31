import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// --- Fake mastery data until Testing Engine is wired up (Teammate C's service) ---
// Shape matches what /docs/API_CONTRACTS.md says Testing Engine will return.
const mockMastery = {
  1: [
    { topic: "recursion", mastery_score: 42, attempts: 3 },
    { topic: "loops", mastery_score: 91, attempts: 5 },
  ],
};

const ESCALATION_THRESHOLD = 60;
const MIN_ATTEMPTS_BEFORE_ESCALATION = 3;

// GET /buddy/recommendation?user_id=1
router.get("/recommendation", requireAuth, (req, res) => {
  const userId = Number(req.query.user_id) || req.user.id;
  const mastery = mockMastery[userId] || [];

  const weakest = mastery.sort((a, b) => a.mastery_score - b.mastery_score)[0];

  if (!weakest) {
    return res.json({ topic: "Python basics", reason: "Getting started — no activity yet." });
  }

  res.json({
    topic: weakest.topic,
    reason: `Mastery score is ${weakest.mastery_score}/100 after ${weakest.attempts} attempts — this is your weakest tracked topic.`,
  });
});

// POST /buddy/chat { user_id, message }
router.post("/chat", requireAuth, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const lower = message.toLowerCase();
  const mastery = mockMastery[userId] || [];
  const strugglingTopic = mastery.find(
    (m) => m.mastery_score < ESCALATION_THRESHOLD && m.attempts >= MIN_ATTEMPTS_BEFORE_ESCALATION
  );

  // Only escalate when the student is actually asking for help/a mentor,
  // AND there's real evidence (mastery data) that escalation is warranted.
  const askedForHelp = /\b(stuck|help|mentor|confused|struggl|don'?t understand|can'?t figure)\b/.test(lower);

  if (askedForHelp && strugglingTopic) {
    return res.json({
      reply: `I've noticed you've attempted "${strugglingTopic.topic}" ${strugglingTopic.attempts} times with a mastery score of ${strugglingTopic.mastery_score}/100. A live session might help more than text at this point.`,
      escalate_to_mentor: true,
      suggested_topic: strugglingTopic.topic,
    });
  }

  // Real AI reply via Google's Gemini API (free tier, no credit card needed).
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      reply: "AI Buddy isn't fully connected yet — GEMINI_API_KEY is missing from .env.",
      escalate_to_mentor: false,
    });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are AI Buddy, a friendly coding tutor inside a learning platform called CloudMentor AI. A student asked: "${message}". Give a clear, encouraging, concise answer (2-4 sentences unless code is needed).`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini API error:", data);
      return res.json({
        reply: "AI Buddy hit an error talking to Gemini — check the server logs for details.",
        escalate_to_mentor: false,
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a reply — try rephrasing your question.";

    res.json({ reply, escalate_to_mentor: false });
  } catch (err) {
    console.error("Gemini fetch failed:", err);
    res.json({
      reply: "AI Buddy couldn't reach Gemini right now — check your internet connection and API key.",
      escalate_to_mentor: false,
    });
  }
});

// GET /buddy/weekly-report?user_id=1
router.get("/weekly-report", requireAuth, (req, res) => {
  const userId = Number(req.query.user_id) || req.user.id;
  const mastery = mockMastery[userId] || [];

  res.json({
    summary_text:
      mastery.length > 0
        ? `This week you practiced ${mastery.length} topic(s). Weakest: ${mastery.sort((a, b) => a.mastery_score - b.mastery_score)[0].topic}.`
        : "No activity yet this week.",
    next_week_plan: "Focus on your weakest topic and attempt at least one test on it.",
  });
});

export default router;