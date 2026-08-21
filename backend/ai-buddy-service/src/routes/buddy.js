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
router.post("/chat", requireAuth, (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  // TODO: replace this rule-based stub with a real call to the Anthropic API.
  // Example:
  //   const response = await fetch("https://api.anthropic.com/v1/messages", { ... })
  // Keep the response shape { reply, escalate_to_mentor, suggested_mentor_id? } stable
  // so the frontend and Skill Exchange integration don't need to change.

  const mastery = mockMastery[userId] || [];
  const strugglingTopic = mastery.find(
    (m) => m.mastery_score < ESCALATION_THRESHOLD && m.attempts >= MIN_ATTEMPTS_BEFORE_ESCALATION
  );

  if (strugglingTopic) {
    return res.json({
      reply: `I've noticed you've attempted "${strugglingTopic.topic}" ${strugglingTopic.attempts} times with a mastery score of ${strugglingTopic.mastery_score}/100. A live session might help more than text at this point.`,
      escalate_to_mentor: true,
      suggested_topic: strugglingTopic.topic,
    });
  }

  res.json({
    reply: `(stub reply) You asked: "${message}". Wire this up to the Anthropic API in src/routes/buddy.js.`,
    escalate_to_mentor: false,
  });
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
