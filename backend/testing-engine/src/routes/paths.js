import { Router } from "express";
import { questions, questionTypesForTopic } from "../data/questions.js";
import {
  LEARNING_PATHS,
  TOPIC_MAP,
  PASS_THRESHOLD,
} from "../data/learningPaths.js";
import {
  getTopicStatus,
  getPrerequisiteProgress,
  getProgressForUser,
  isTopicUnlocked,
} from "../data/progress.js";

const router = Router();

// ── Helpers ───────────────────────────────────────────────────────────────────

function questionCountsForTopic(topicId) {
  const pool = questions.filter((q) => q.topic === topicId);
  return {
    easy:   pool.filter((q) => q.difficulty === "easy").length,
    medium: pool.filter((q) => q.difficulty === "medium").length,
    hard:   pool.filter((q) => q.difficulty === "hard").length,
    total:  pool.length,
  };
}

function buildTopicCard(userId, topicDef, progressMap) {
  const rec    = progressMap[topicDef.id] || null;
  const status = getTopicStatus(userId, topicDef.id);
  const prereqProgress = getPrerequisiteProgress(userId, topicDef.id);
  const counts = questionCountsForTopic(topicDef.id);
  const types = questionTypesForTopic(topicDef.id); // [{type,easy,medium,hard,total}]

  return {
    id:              topicDef.id,
    label:           topicDef.label,
    description:     topicDef.description,
    icon:            topicDef.icon,
    order:           topicDef.order,
    prerequisites:   topicDef.prerequisites,
    prereq_progress: prereqProgress,  // [{topic, label, best_score, required, met}]
    status,                           // locked | available | in_progress | completed
    counts,                           // { easy, medium, hard, total }  (all types)
    types,                            // [{ type, easy, medium, hard, total }] (non-empty only)
    mastery_score:   rec?.mastery_score  ?? null,
    best_score:      rec?.best_score     ?? null,
    latest_score:    rec?.latest_score   ?? null,
    attempts:        rec?.attempts       ?? 0,
    passed_attempts: rec?.passed_attempts ?? 0,
    failed_attempts: rec?.failed_attempts ?? 0,
    level:           rec?.level          ?? null,
    pass_threshold:  PASS_THRESHOLD,
  };
}

// ── GET /paths ────────────────────────────────────────────────────────────────
// Returns all learning paths with topic cards + per-user unlock/progress state.
router.get("/", (req, res) => {
  const userId     = req.user.id;
  const userProgress = Object.fromEntries(
    getProgressForUser(userId).map((p) => [p.topic, p])
  );

  const paths = LEARNING_PATHS.map((path) => {
    const topics     = path.topics.map((t) => buildTopicCard(userId, t, userProgress));
    const completed  = topics.filter((t) => t.status === "completed").length;
    const total      = topics.length;
    const pct        = total ? Math.round((completed / total) * 100) : 0;

    return {
      id:          path.id,
      label:       path.label,
      icon:        path.icon,
      description: path.description,
      topics,
      progress_pct: pct,
      completed_count: completed,
      total_count:     total,
    };
  });

  res.json({ paths, pass_threshold: PASS_THRESHOLD });
});

// ── GET /paths/:pathId ────────────────────────────────────────────────────────
router.get("/:pathId", (req, res) => {
  const path = LEARNING_PATHS.find((p) => p.id === req.params.pathId);
  if (!path) return res.status(404).json({ error: "Learning path not found" });

  const userId = req.user.id;
  const userProgress = Object.fromEntries(
    getProgressForUser(userId).map((p) => [p.topic, p])
  );

  const topics = path.topics.map((t) => buildTopicCard(userId, t, userProgress));
  res.json({ path: { ...path, topics }, pass_threshold: PASS_THRESHOLD });
});

// ── GET /paths/topic/:topicId/check ──────────────────────────────────────────
// Lightweight prerequisite check — used before starting a quiz.
router.get("/topic/:topicId/check", (req, res) => {
  const { topicId } = req.params;
  const userId = req.user.id;
  const unlocked = isTopicUnlocked(userId, topicId);
  const prereqProgress = getPrerequisiteProgress(userId, topicId);

  if (!unlocked) {
    return res.status(403).json({
      unlocked: false,
      error: `Topic "${topicId}" is locked. Complete prerequisites first.`,
      prereq_progress: prereqProgress,
      pass_threshold: PASS_THRESHOLD,
    });
  }

  res.json({ unlocked: true, prereq_progress: prereqProgress });
});

export default router;
