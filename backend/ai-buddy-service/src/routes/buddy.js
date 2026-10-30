import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { fetchMastery } from "../lib/testingEngine.js";
import { askGemini } from "../lib/gemini.js";

const router = Router();

const ESCALATION_THRESHOLD = 60;
const MIN_ATTEMPTS_BEFORE_ESCALATION = 3;

function weakestTopic(mastery) {
  if (!mastery.length) return null;
  return [...mastery].sort((a, b) => a.mastery_score - b.mastery_score)[0];
}

function strugglingTopic(mastery) {
  return mastery.find(
    (m) => m.mastery_score < ESCALATION_THRESHOLD && m.attempts >= MIN_ATTEMPTS_BEFORE_ESCALATION
  );
}

// GET /buddy/recommendation
router.get("/recommendation", requireAuth, async (req, res) => {
  const mastery = await fetchMastery(req.headers.authorization);
  const weakest = weakestTopic(mastery);

  if (!weakest) {
    return res.json({ topic: "Variables & Data Types", reason: "Getting started — no test activity yet. Begin with Variables in the Programming Fundamentals path." });
  }

  // Surface locked topics as a nudge
  const locked = mastery.filter((m) => m.status === "locked");
  const inProgress = mastery.filter((m) => m.status === "in_progress");

  if (inProgress.length > 0) {
    const t = inProgress[0];
    return res.json({
      topic: t.topic,
      reason: `You're in progress on "${t.topic}" with best score ${t.best_score ?? 0}%. Keep going — you need ${70}% to unlock the next topic.`,
    });
  }

  res.json({
    topic: weakest.topic,
    reason: `Mastery score is ${weakest.mastery_score}/100 after ${weakest.attempts} attempts — this is your weakest tracked topic.`,
  });
});

// POST /buddy/chat { message }
router.post("/chat", requireAuth, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const lower = message.toLowerCase();
  const mastery = await fetchMastery(req.headers.authorization);
  const stuck = strugglingTopic(mastery);
  const askedForHelp = /\b(stuck|help|mentor|confused|struggl|don'?t understand|can'?t figure)\b/.test(lower);

  if (askedForHelp && stuck) {
    return res.json({
      reply: `I've noticed you've attempted "${stuck.topic}" ${stuck.attempts} times with a mastery score of ${stuck.mastery_score}/100. A live session might help more than text at this point.`,
      escalate_to_mentor: true,
      suggested_topic: stuck.topic,
    });
  }

  try {
    const result = await askGemini(
      `You are AI Buddy, a friendly coding tutor inside a learning platform called CloudMentor AI. A student asked: "${message}". Give a clear, encouraging, concise answer (2-4 sentences unless code is needed).`
    );
    if (result.error) {
      return res.json({
        reply: result.error.includes("GEMINI_API_KEY")
          ? "AI Buddy isn't fully connected yet — GEMINI_API_KEY is missing from .env."
          : "AI Buddy hit an error talking to Gemini — check the server logs for details.",
        escalate_to_mentor: false,
      });
    }
    res.json({ reply: result.reply, escalate_to_mentor: false });
  } catch (err) {
    console.error("Gemini fetch failed:", err);
    res.json({
      reply: "AI Buddy couldn't reach Gemini right now — check your internet connection and API key.",
      escalate_to_mentor: false,
    });
  }
});

// POST /buddy/explain-mistakes { missed: [{ prompt, topic, selected_text, correct_text }] }
router.post("/explain-mistakes", requireAuth, async (req, res) => {
  const missed = Array.isArray(req.body.missed) ? req.body.missed : [];
  if (missed.length === 0) {
    return res.status(400).json({ error: "missed must be a non-empty array" });
  }

  const lines = missed
    .map(
      (item, i) =>
        `${i + 1}. Topic: ${item.topic || "unknown"}. Question: ${item.prompt}. Student chose: ${item.selected_text || "(blank)"}. Correct answer: ${item.correct_text}.`
    )
    .join("\n");

  try {
    const result = await askGemini(
      `You are AI Buddy, a friendly coding tutor. A student missed these quiz questions. For each one, write 1-2 sentences explaining why the correct answer is right and what the student likely misunderstood. Number the explanations to match. Be encouraging, not condescending.\n\n${lines}`
    );
    if (result.error) {
      return res.json({
        explanations: result.error.includes("GEMINI_API_KEY")
          ? "Add GEMINI_API_KEY to .env to get mistake explanations."
          : "Could not generate explanations right now.",
      });
    }
    res.json({ explanations: result.reply });
  } catch (err) {
    console.error("Gemini fetch failed:", err);
    res.json({ explanations: "Could not reach Gemini for explanations right now." });
  }
});

// POST /buddy/weak-concepts { topic, results: [{prompt, correct, selected_text, correct_text, difficulty, type}] }
// Returns targeted explanation grounded in actual wrong answers.
router.post("/weak-concepts", requireAuth, async (req, res) => {
  const { topic, results = [] } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const wrong = results.filter((r) => !r.correct);
  if (wrong.length === 0) {
    return res.json({ reply: `Good news — you didn't make any errors on ${topic} this time. Keep up the strong work!` });
  }

  const lines = wrong.map((r, i) =>
    `${i + 1}. [${r.type || "mcq"} / ${r.difficulty}] ${r.prompt || r.code || ""}. You answered: "${r.selected_text || "—"}". Correct: "${r.correct_text || "—"}".`
  ).join("\n");

  const prompt = `You are AI Buddy, a friendly coding tutor. A student is in Recovery Mode for the topic "${topic}". They made these mistakes:\n\n${lines}\n\nIdentify the 2-3 most important concepts they need to review. For each concept: (1) name it clearly, (2) explain it in 1-2 simple sentences with a beginner-friendly example, (3) give one specific thing the student should practice. Be encouraging. Format as a numbered list.`;

  try {
    const result = await askGemini(prompt);
    if (result.error) return res.json({ reply: "Practice the questions you got wrong and focus on understanding the correct answers one by one." });
    res.json({ reply: result.reply });
  } catch {
    res.json({ reply: "Practice the questions you got wrong and focus on understanding the correct answers one by one." });
  }
});
router.get("/weekly-report", requireAuth, async (req, res) => {
  const mastery = await fetchMastery(req.headers.authorization);
  const weakest = weakestTopic(mastery);

  res.json({
    summary_text: weakest
      ? `You have mastery data for ${mastery.length} topic(s). Weakest: ${weakest.topic} (${weakest.mastery_score}/100 after ${weakest.attempts} attempts).`
      : "No test activity yet this week.",
    next_week_plan: weakest
      ? `Focus on ${weakest.topic} and take at least one more quiz on it.`
      : "Take your first quiz so I can build a study plan.",
  });
});

// POST /buddy/topic-help { topic, status, prereq_progress, best_score }
// Explains a locked topic and gives actionable advice.
router.post("/topic-help", requireAuth, async (req, res) => {
  const { topic, status, prereq_progress = [], best_score = 0 } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  let prompt;

  if (status === "locked") {
    const unmet = prereq_progress.filter((p) => !p.met);
    const prereqLines = unmet
      .map((p) => `- ${p.label}: your best score is ${p.best_score}%, need ${p.required}%`)
      .join("\n");

    prompt = `You are AI Buddy, a friendly coding tutor on CloudMentor AI. A student wants to study "${topic}" but it is locked because they haven't passed its prerequisites yet. Here are the unmet prerequisites:\n${prereqLines}\n\nGive a warm, encouraging response (3-5 sentences) that: 1) explains why the prerequisites matter, 2) gives one specific study tip for the hardest unmet prerequisite, 3) encourages them to retry.`;
  } else if (status === "in_progress") {
    prompt = `You are AI Buddy, a friendly coding tutor. A student is working on "${topic}" and has a best score of ${best_score}% but needs 70% to complete it. Give a short (2-3 sentence) encouraging tip that helps them improve on this specific topic.`;
  } else {
    prompt = `You are AI Buddy, a friendly coding tutor. A student is asking about "${topic}" which they have already completed with ${best_score}%. Give a short (2-3 sentence) note congratulating them and suggesting what to explore next.`;
  }

  try {
    const result = await askGemini(prompt);
    if (result.error) {
      return res.json({ reply: "Keep working on your prerequisites — you're almost there!" });
    }
    res.json({ reply: result.reply });
  } catch {
    res.json({ reply: "Keep working on your prerequisites — you're almost there!" });
  }
});

export default router;
