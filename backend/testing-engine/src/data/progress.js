// ── Per-user progress store ───────────────────────────────────────────────────
//
// FIX: Previously `recordAttempt` incremented `attempts` per QUESTION, inflating
// the count (e.g. 5 questions × 3 quizzes = 15). Now `recordAttempt` only
// updates mastery_score. The formal quiz attempt count is derived from
// `history.length` (one entry per quiz, added by `recordQuizResult`).
//
// Shape:
//   progress[userId][topicId] = {
//     mastery_score     : 0–100   (weighted moving score, updated per question)
//     best_score        : 0–100   (highest single quiz %)
//     latest_score      : 0–100   (most recent quiz %)
//     quiz_attempts     : int     (formal quiz attempts = history.length)
//     passed_attempts   : int
//     failed_attempts   : int
//     practice_count    : int     (practice quizzes, never inflates formal count)
//     history           : [{ attempt_number, score, passed, difficulty, timestamp, mode }]
//   }

import { PASS_THRESHOLD, TOPIC_MAP } from "./learningPaths.js";

export { PASS_THRESHOLD };

export function getLevel(score) {
  if (score >= 80) return "Advanced";
  if (score >= 50) return "Intermediate";
  return "Beginner";
}

export function didPass(scorePercent) {
  return scorePercent >= PASS_THRESHOLD;
}

const progress = {}; // { [userId]: { [topicId]: TopicProgress } }

const DIFFICULTY_WEIGHT = { easy: 8, medium: 12, hard: 18 };
const DEFAULT_WEIGHT = 10;

function ensureTopic(userId, topicId) {
  if (!progress[userId]) progress[userId] = {};
  if (!progress[userId][topicId]) {
    progress[userId][topicId] = {
      mastery_score:    50,
      best_score:      0,
      latest_score:    0,
      quiz_attempts:   0,
      passed_attempts: 0,
      failed_attempts: 0,
      practice_count:  0,
      history:         [],
    };
  }
  return progress[userId][topicId];
}

// ── recordAttempt (per question — mastery score only, NO attempt count) ────────
export function recordAttempt(userId, topicId, wasCorrect, difficulty = "medium") {
  const rec = ensureTopic(userId, topicId);
  const weight = DIFFICULTY_WEIGHT[difficulty] ?? DEFAULT_WEIGHT;
  const delta  = wasCorrect ? weight : -weight;
  rec.mastery_score = Math.max(0, Math.min(100, rec.mastery_score + delta));
  return rec;
}

// ── recordQuizResult (per quiz — the ONE place quiz attempts are counted) ──────
// mode: "formal" | "practice" | "reassessment"
export function recordQuizResult(userId, topicId, scorePercent, difficulty = "all", mode = "formal") {
  const rec = ensureTopic(userId, topicId);
  const passed = didPass(scorePercent);

  rec.latest_score = scorePercent;
  if (scorePercent > rec.best_score) rec.best_score = scorePercent;

  if (mode === "practice") {
    rec.practice_count += 1;
  } else {
    // formal or reassessment — counts toward quiz_attempts
    rec.quiz_attempts += 1;
    if (passed) rec.passed_attempts += 1;
    else        rec.failed_attempts += 1;
  }

  rec.history.push({
    attempt_number: mode === "practice" ? rec.practice_count : rec.quiz_attempts,
    score:          scorePercent,
    passed,
    difficulty,
    mode,
    timestamp:      new Date().toISOString(),
  });

  return rec;
}

// ── Unlock state ──────────────────────────────────────────────────────────────
export function isTopicUnlocked(userId, topicId) {
  const topicDef = TOPIC_MAP[topicId];
  if (!topicDef || topicDef.prerequisites.length === 0) return true;

  const userProgress = progress[userId] || {};
  return topicDef.prerequisites.every((prereqId) => {
    const prereqRec = userProgress[prereqId];
    return prereqRec && prereqRec.best_score >= PASS_THRESHOLD;
  });
}

export function getTopicStatus(userId, topicId) {
  if (!isTopicUnlocked(userId, topicId)) return "locked";
  const rec = (progress[userId] || {})[topicId];
  if (!rec || rec.quiz_attempts === 0) return "available";
  if (rec.best_score >= PASS_THRESHOLD) return "completed";
  return "in_progress";
}

// ── getProgressForUser ────────────────────────────────────────────────────────
export function getProgressForUser(userId) {
  const userProgress = progress[userId] || {};
  return Object.entries(userProgress).map(([topicId, data]) => ({
    topic:           topicId,
    mastery_score:   data.mastery_score,
    best_score:      data.best_score,
    latest_score:    data.latest_score,
    // FIX: attempts = formal quiz count (history filtered to non-practice),
    // NOT per-question count.
    attempts:        data.quiz_attempts,
    passed_attempts: data.passed_attempts,
    failed_attempts: data.failed_attempts,
    practice_count:  data.practice_count,
    level:           getLevel(data.mastery_score),
    status:          getTopicStatus(userId, topicId),
    history:         data.history,
  }));
}

export function getPrerequisiteProgress(userId, topicId) {
  const topicDef = TOPIC_MAP[topicId];
  if (!topicDef || topicDef.prerequisites.length === 0) return [];

  const userProgress = progress[userId] || {};
  return topicDef.prerequisites.map((prereqId) => {
    const prereqDef = TOPIC_MAP[prereqId];
    const rec       = userProgress[prereqId];
    return {
      topic:      prereqId,
      label:      prereqDef?.label || prereqId,
      best_score: rec?.best_score || 0,
      required:   PASS_THRESHOLD,
      met:        (rec?.best_score || 0) >= PASS_THRESHOLD,
    };
  });
}

// Expose for config-driven modules that import from progress.js
export {
  MAX_FORMAL_ATTEMPTS,
  RECOVERY_PRACTICE_TARGET,
  RECOVERY_PRACTICE_MIN_SCORE,
  MAX_REASSESSMENT_ATTEMPTS,
  ATTEMPT_EXPIRY_MINUTES,
} from "./config.js";
