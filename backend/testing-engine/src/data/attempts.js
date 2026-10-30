// ── Formal assessment attempt store ───────────────────────────────────────────
//
// Tracks formal assessment attempts per (student, topic, qtype, difficulty).
// Enforces MAX_FORMAL_ATTEMPTS, handles resume/refresh without duplicates,
// tracks recovery progress, and grants reassessment attempts.
//
// configKey = `${topic}:${qtype}:${difficulty}`
//
// Attempt = {
//   id, userId, topic, qtype, difficulty,
//   status: "in_progress" | "completed" | "abandoned",
//   score, percentage, passed,
//   startedAt, completedAt,
//   isReassessment: boolean,
// }

import {
  MAX_FORMAL_ATTEMPTS,
  RECOVERY_PRACTICE_TARGET,
  RECOVERY_PRACTICE_MIN_SCORE,
  MAX_REASSESSMENT_ATTEMPTS,
  ATTEMPT_EXPIRY_MINUTES,
} from "./config.js";

const store = {}; // { [userId]: { [configKey]: [Attempt] } }

function key(topic, qtype, difficulty) {
  return `${topic}:${qtype}:${difficulty}`;
}

function ensureUser(userId) {
  if (!store[userId]) store[userId] = {};
  return store[userId];
}

function getAttempts(userId, topic, qtype, difficulty) {
  const u = ensureUser(userId);
  const k = key(topic, qtype, difficulty);
  if (!u[k]) u[k] = [];
  return u[k];
}

function expireOldAttempts(attempts) {
  const now = Date.now();
  const expiryMs = ATTEMPT_EXPIRY_MINUTES * 60 * 1000;
  for (const a of attempts) {
    if (a.status === "in_progress" && now - new Date(a.startedAt).getTime() > expiryMs) {
      a.status = "abandoned";
    }
  }
}

// ── Counting ──────────────────────────────────────────────────────────────────

/** Completed or abandoned formal attempts (in_progress ones are NOT counted
 *  toward the limit — they can be resumed). Reassessment attempts tracked
 *  separately via isReassessment flag. */
export function getFormalAttemptCount(userId, topic, qtype, difficulty) {
  const attempts = getAttempts(userId, topic, qtype, difficulty);
  expireOldAttempts(attempts);
  return attempts.filter((a) => !a.isReassessment && (a.status === "completed" || a.status === "abandoned")).length;
}

export function getReassessmentAttemptCount(userId, topic, qtype, difficulty) {
  const attempts = getAttempts(userId, topic, qtype, difficulty);
  return attempts.filter((a) => a.isReassessment && (a.status === "completed" || a.status === "abandoned")).length;
}

export function getAttemptsRemaining(userId, topic, qtype, difficulty) {
  const used = getFormalAttemptCount(userId, topic, qtype, difficulty);
  return Math.max(0, MAX_FORMAL_ATTEMPTS - used);
}

export function getReassessmentRemaining(userId, topic, qtype, difficulty) {
  const used = getReassessmentAttemptCount(userId, topic, qtype, difficulty);
  return Math.max(0, MAX_REASSESSMENT_ATTEMPTS - used);
}

// ── Find in-progress attempt to resume ────────────────────────────────────────

export function getInProgressAttempt(userId, topic, qtype, difficulty) {
  const attempts = getAttempts(userId, topic, qtype, difficulty);
  expireOldAttempts(attempts);
  return attempts.find((a) => a.status === "in_progress") || null;
}

// ── Start a new formal attempt ────────────────────────────────────────────────
// Returns { ok, attempt, error? }
export function startFormalAttempt(userId, topic, qtype, difficulty, isReassessment = false) {
  const attempts = getAttempts(userId, topic, qtype, difficulty);
  expireOldAttempts(attempts);

  // Resume in-progress if exists (prevents duplicates on refresh/re-request)
  const inProgress = attempts.find((a) => a.status === "in_progress");
  if (inProgress) return { ok: true, attempt: inProgress, resumed: true };

  if (isReassessment) {
    // Reassessment limit takes priority over recovery check
    if (getReassessmentRemaining(userId, topic, qtype, difficulty) <= 0) {
      return { ok: false, error: "No reassessment attempts remaining.", code: "NO_REASSESSMENT" };
    }
    // Then check recovery eligibility
    if (!isRecoveryComplete(userId, topic, qtype, difficulty)) {
      return { ok: false, error: "Recovery requirements not yet completed.", code: "RECOVERY_INCOMPLETE" };
    }
  } else {
    // Formal: check limit
    const remaining = getAttemptsRemaining(userId, topic, qtype, difficulty);
    if (remaining <= 0) {
      // Check if recovery is available
      const recoveryComplete = isRecoveryComplete(userId, topic, qtype, difficulty);
      const reassessmentRemaining = getReassessmentRemaining(userId, topic, qtype, difficulty);
      return {
        ok: false,
        error: "Maximum formal attempts reached. Complete recovery requirements to unlock a reassessment.",
        code: recoveryComplete && reassessmentRemaining > 0 ? "REASSESSMENT_AVAILABLE" : "MAX_ATTEMPTS",
      };
    }
  }

  const attempt = {
    id:              `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    topic,
    qtype,
    difficulty,
    status:          "in_progress",
    score:           null,
    percentage:      null,
    passed:          null,
    startedAt:       new Date().toISOString(),
    completedAt:     null,
    isReassessment,
  };
  attempts.push(attempt);
  return { ok: true, attempt, resumed: false };
}

// ── Complete a formal attempt ──────────────────────────────────────────────────
export function completeFormalAttempt(userId, attemptId, score, passed) {
  const u = ensureUser(userId);
  for (const k of Object.keys(u)) {
    const a = u[k].find((a) => a.id === attemptId);
    if (a && a.userId === userId) {
      a.status      = "completed";
      a.score       = score;
      a.percentage  = score;
      a.passed      = passed;
      a.completedAt = new Date().toISOString();
      return a;
    }
  }
  return null;
}

// ── Get full attempt history for a config ────────────────────────────────────
export function getAttemptHistory(userId, topic, qtype, difficulty) {
  const attempts = getAttempts(userId, topic, qtype, difficulty);
  expireOldAttempts(attempts);
  return attempts.map((a) => ({
    id:           a.id,
    status:       a.status,
    score:        a.percentage,
    passed:       a.passed,
    difficulty:   a.difficulty,
    startedAt:    a.startedAt,
    completedAt:  a.completedAt,
    isReassessment: a.isReassessment,
  }));
}

// ── Recovery tracking ─────────────────────────────────────────────────────────
// Recovery is per (topic) — not per config. If a student has used all 3
// attempts on any config for a topic without passing, they enter recovery
// for that topic. They must complete RECOVERY_PRACTICE_TARGET practice quizzes
// with score >= RECOVERY_PRACTICE_MIN_SCORE.

const recoveryStore = {}; // { [userId]: { [topic]: { practicePassed: int, complete: bool } } }

function ensureRecovery(userId, topic) {
  if (!recoveryStore[userId]) recoveryStore[userId] = {};
  if (!recoveryStore[userId][topic]) {
    recoveryStore[userId][topic] = { practicePassed: 0, complete: false };
  }
  return recoveryStore[userId][topic];
}

export function isInRecovery(userId, topic) {
  // A student is in recovery for a topic when there is at least one assessment
  // config (topic:qtype:difficulty) where they:
  //   1. Have used all MAX_FORMAL_ATTEMPTS attempts, AND
  //   2. Have NOT passed any attempt on THAT SPECIFIC config.
  // A pass on a different qtype/difficulty does NOT clear recovery for an
  // exhausted config — the student still needs recovery for the failed config.
  const u = store[userId] || {};
  const topicConfigs = Object.entries(u).filter(([k]) => k.startsWith(`${topic}:`));
  if (topicConfigs.length === 0) return false;

  return topicConfigs.some(([, attempts]) => {
    const formalCompleted = attempts.filter(
      (a) => !a.isReassessment && (a.status === "completed" || a.status === "abandoned")
    ).length;
    if (formalCompleted < MAX_FORMAL_ATTEMPTS) return false; // not exhausted

    // Check if this config was ever passed
    const configPassed = attempts.some((a) => a.status === "completed" && a.passed);
    return !configPassed; // exhausted without passing → in recovery
  });
}

export function recordRecoveryPractice(userId, topic, score) {
  if (score < RECOVERY_PRACTICE_MIN_SCORE) return;
  const r = ensureRecovery(userId, topic);
  r.practicePassed += 1;
  if (r.practicePassed >= RECOVERY_PRACTICE_TARGET) {
    r.complete = true;
  }
}

export function isRecoveryComplete(userId, topic, qtype, difficulty) {
  // Recovery is per-topic, not per-config
  const r = (recoveryStore[userId] || {})[topic];
  return r?.complete === true;
}

export function getRecoveryStatus(userId, topic) {
  const r = ensureRecovery(userId, topic);
  return {
    inRecovery:      isInRecovery(userId, topic),
    practicePassed:  r.practicePassed,
    practiceTarget:  RECOVERY_PRACTICE_TARGET,
    practiceMinScore: RECOVERY_PRACTICE_MIN_SCORE,
    complete:        r.complete,
  };
}

export function resetRecoveryIfPassed(userId, topic) {
  // If the student passes any attempt, clear recovery for that topic
  if (recoveryStore[userId]?.[topic]) {
    recoveryStore[userId][topic] = { practicePassed: 0, complete: false };
  }
}
