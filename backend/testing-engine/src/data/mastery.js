// In-memory mastery store — swap for Postgres later.
// Scoring is difficulty-weighted; level is derived from mastery_score.

const mastery = {}; // { [userId]: { [topic]: { mastery_score, attempts, passed_attempts, failed_attempts } } }

// ── Difficulty weights ───────────────────────────────────────────────────────
// Correct on a hard question moves the needle more than an easy one.
const DIFFICULTY_WEIGHT = { easy: 8, medium: 12, hard: 18 };
const DEFAULT_WEIGHT = 10; // fallback if difficulty tag is missing

// ── Level thresholds ─────────────────────────────────────────────────────────
export const LEVEL_THRESHOLDS = {
  BEGINNER:     { min: 0,  max: 49,  label: "Beginner" },
  INTERMEDIATE: { min: 50, max: 79,  label: "Intermediate" },
  ADVANCED:     { min: 80, max: 100, label: "Advanced" },
};

export function getLevel(score) {
  if (score >= LEVEL_THRESHOLDS.ADVANCED.min)     return LEVEL_THRESHOLDS.ADVANCED.label;
  if (score >= LEVEL_THRESHOLDS.INTERMEDIATE.min) return LEVEL_THRESHOLDS.INTERMEDIATE.label;
  return LEVEL_THRESHOLDS.BEGINNER.label;
}

// ── Pass rule ────────────────────────────────────────────────────────────────
export const PASS_THRESHOLD = 70; // percent — must score >= 70% to "pass" a quiz

export function didPass(scorePercent) {
  return scorePercent >= PASS_THRESHOLD;
}

// ── recordAttempt ─────────────────────────────────────────────────────────────
// difficulty: "easy" | "medium" | "hard" — used for weighted score delta
export function recordAttempt(userId, topic, wasCorrect, difficulty = "medium") {
  if (!mastery[userId]) mastery[userId] = {};
  if (!mastery[userId][topic]) {
    mastery[userId][topic] = {
      mastery_score: 50, // start neutral
      attempts: 0,
      passed_attempts: 0,
      failed_attempts: 0,
    };
  }

  const record = mastery[userId][topic];
  record.attempts += 1;

  const weight = DIFFICULTY_WEIGHT[difficulty] ?? DEFAULT_WEIGHT;
  const delta  = wasCorrect ? weight : -weight;
  record.mastery_score = Math.max(0, Math.min(100, record.mastery_score + delta));

  return record;
}

// ── recordQuizResult ──────────────────────────────────────────────────────────
// Call once per quiz submission to track overall pass/fail counts per topic.
export function recordQuizResult(userId, topic, passed) {
  if (!mastery[userId]?.[topic]) return;
  if (passed) mastery[userId][topic].passed_attempts += 1;
  else        mastery[userId][topic].failed_attempts += 1;
}

// ── getMasteryForUser ─────────────────────────────────────────────────────────
export function getMasteryForUser(userId) {
  const userMastery = mastery[userId] || {};
  return Object.entries(userMastery).map(([topic, data]) => ({
    topic,
    mastery_score:   data.mastery_score,
    attempts:        data.attempts,
    passed_attempts: data.passed_attempts,
    failed_attempts: data.failed_attempts,
    level:           getLevel(data.mastery_score),
  }));
}
