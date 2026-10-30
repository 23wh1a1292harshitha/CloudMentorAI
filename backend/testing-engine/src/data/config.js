// ── Centralised assessment configuration ───────────────────────────────────────
// All tunable thresholds in one place so they can be changed without code edits.

// Maximum formal assessment attempts per student, per (topic + type + difficulty).
export const MAX_FORMAL_ATTEMPTS = 3;

// Passing percentage threshold (must score >= this to "pass" and unlock prereqs).
export const PASS_THRESHOLD = 70;

// Recovery mode: number of practice quizzes the student must complete before
// becoming eligible for a reassessment attempt.
export const RECOVERY_PRACTICE_TARGET = 3;

// Minimum score a practice quiz must reach to count toward recovery.
export const RECOVERY_PRACTICE_MIN_SCORE = 50;

// Maximum reassessment attempts granted after recovery completion.
export const MAX_REASSESSMENT_ATTEMPTS = 1;

// An in-progress formal attempt auto-expires to "abandoned" after this many
// minutes, but still counts toward the attempt limit.
export const ATTEMPT_EXPIRY_MINUTES = 30;
