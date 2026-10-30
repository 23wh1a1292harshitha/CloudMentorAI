import { Router } from "express";
import {
  questions,
  pickQuestionsForUser,
  questionTypesForTopic,
  QUESTION_TYPES,
} from "../data/questions.js";
import {
  recordAttempt,
  recordQuizResult,
  getProgressForUser,
  getTopicStatus,
  isTopicUnlocked,
  getPrerequisiteProgress,
  didPass,
  getLevel,
  PASS_THRESHOLD,
} from "../data/progress.js";
import {
  MAX_FORMAL_ATTEMPTS,
  RECOVERY_PRACTICE_TARGET,
  RECOVERY_PRACTICE_MIN_SCORE,
} from "../data/config.js";
import {
  startFormalAttempt,
  completeFormalAttempt,
  getInProgressAttempt,
  getAttemptsRemaining,
  getFormalAttemptCount,
  getReassessmentRemaining,
  getAttemptHistory,
  isInRecovery,
  recordRecoveryPractice,
  isRecoveryComplete,
  getRecoveryStatus,
  resetRecoveryIfPassed,
} from "../data/attempts.js";
import { isCodeExecConfigured, runCode } from "../lib/codeRunner.js";

const router = Router();

// ── POST /tests/start ──────────────────────────────────────────────────────────
// Starts (or resumes) a formal assessment attempt.
// Body: { topic, qtype, difficulty, isReassessment? }
router.post("/start", (req, res) => {
  const userId     = req.user.id;
  const topic      = req.body.topic      || null;
  const qtype      = req.body.qtype      || "mcq";
  const difficulty = req.body.difficulty || "all";
  const isReassess = req.body.isReassessment === true;

  if (!topic) return res.status(400).json({ error: "topic is required" });

  // Prerequisite check
  if (!isTopicUnlocked(userId, topic)) {
    return res.status(403).json({
      error: `Topic "${topic}" is locked. Complete its prerequisites first.`,
      prereq_progress: getPrerequisiteProgress(userId, topic),
      pass_threshold: PASS_THRESHOLD,
    });
  }

  // Start or resume attempt (idempotent — refresh/re-request resumes, no dupes)
  const result = startFormalAttempt(userId, topic, qtype, difficulty, isReassess);
  if (!result.ok) {
    return res.status(403).json({
      error: result.error,
      code: result.code,
      max_attempts: MAX_FORMAL_ATTEMPTS,
      attempts_used: getFormalAttemptCount(userId, topic, qtype, difficulty),
      recovery: getRecoveryStatus(userId, topic),
    });
  }

  const attempt = result.attempt;
  const mastery = getProgressForUser(userId);
  const diff    = difficulty === "all" ? null : difficulty;
  const testQuestions = pickQuestionsForUser(topic, mastery, diff, qtype);

  if (testQuestions.length === 0) {
    return res.status(404).json({
      error: `No ${qtype} questions found for topic "${topic}"${difficulty !== "all" ? ` at difficulty "${difficulty}"` : ""}`,
    });
  }

  res.json({
    attempt_id:      attempt.id,
    resumed:         result.resumed,
    topic,
    qtype,
    difficulty,
    questions:       testQuestions,
    pass_mark:       PASS_THRESHOLD,
    max_attempts:    MAX_FORMAL_ATTEMPTS,
    attempts_used:   getFormalAttemptCount(userId, topic, qtype, difficulty),
    attempts_remaining: getAttemptsRemaining(userId, topic, qtype, difficulty),
    is_reassessment: attempt.isReassessment,
  });
});

// ── GET /tests/next (PRACTICE MODE — unlimited, no attempt record) ────────────
router.get("/next", (req, res) => {
  const topic      = req.query.topic      || null;
  const difficulty = req.query.difficulty || null;
  const type       = req.query.type       || null;
  const userId     = req.user.id;

  if (topic && !isTopicUnlocked(userId, topic)) {
    const prereqs = getPrerequisiteProgress(userId, topic);
    return res.status(403).json({
      error: `Topic "${topic}" is locked. Complete its prerequisites first.`,
      prereq_progress: prereqs,
      pass_threshold: PASS_THRESHOLD,
    });
  }

  const mastery       = getProgressForUser(userId);
  const diff          = difficulty === "all" ? null : difficulty;
  const testQuestions = pickQuestionsForUser(topic, mastery, diff, type);

  if (testQuestions.length === 0) {
    return res.status(404).json({
      error: topic
        ? `No${type ? ` ${type}` : ""} questions found for topic "${topic}"${difficulty ? ` at difficulty "${difficulty}"` : ""}`
        : "No questions in the bank",
    });
  }

  res.json({
    test_id:     "practice_" + Date.now(),
    topic:       topic || "adaptive",
    difficulty:  difficulty || "mixed",
    qtype:       type || "mixed",
    questions:   testQuestions,
    pass_mark:   PASS_THRESHOLD,
    is_practice: true,
  });
});

// ── GET /tests/types?topic= ──────────────────────────────────────────────────
router.get("/types", (req, res) => {
  const topic = req.query.topic || null;
  if (!topic) return res.status(400).json({ error: "topic query parameter is required" });
  res.json({ topic, types: questionTypesForTopic(topic) });
});

// ── POST /tests/run-code ──────────────────────────────────────────────────────
router.post("/run-code", async (req, res) => {
  const { question_id, language, code } = req.body;
  const question = questions.find((q) => q.id === question_id);
  if (!question)          return res.status(404).json({ error: "Question not found" });
  if (question.type !== "coding") return res.status(400).json({ error: "Not a coding question" });
  if (!question.languages.includes(language)) return res.status(400).json({ error: `Language "${language}" not supported` });
  if (!code || !code.trim()) return res.status(400).json({ error: "Code is required" });

  const result = await runCode(language, code, question.sample_test_cases || []);
  res.json({ ...result, is_sample: true });
});

// ── POST /tests/submit ────────────────────────────────────────────────────────
// Body: { attempt_id?, answers[] }
//   - With attempt_id:  formal/reassessment submission (completes the attempt)
//   - Without:         practice submission (unlimited, updates mastery only)
router.post("/submit", async (req, res) => {
  const userId     = req.user.id;
  const { answers, attempt_id } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "a non-empty answers array is required" });
  }

  const isFormal = !!attempt_id;
  let mode = "practice";

  // ── Evaluate answers (same logic for all modes) ─────────────────────────────
  let earnedMarks = 0, maxMarks = 0;
  const topicsTouched = new Set();
  const difficultyTally = {
    easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 },
  };
  const typeTally = Object.fromEntries(QUESTION_TYPES.map((t) => [t, { correct: 0, total: 0 }]));
  const results = [];

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.question_id);
    if (!question) continue;

    const diff = question.difficulty || "medium";
    const qMarks = question.marks ?? 1;
    maxMarks += qMarks;
    let wasCorrect = false;

    if (question.type === "coding") {
      const allCases = [...(question.sample_test_cases || []), ...(question.hidden_test_cases || [])];
      const codingResult = await runCode(answer.language || "python", answer.code || "", allCases);
      typeTally.coding.total += 1;
      difficultyTally[diff].total += 1;
      if (codingResult.configured && codingResult.total > 0) {
        const ratio = codingResult.passed / codingResult.total;
        earnedMarks += Math.round(qMarks * ratio);
        wasCorrect = ratio === 1;
      }
      if (wasCorrect) { typeTally.coding.correct += 1; difficultyTally[diff].correct += 1; }
      recordAttempt(userId, question.topic, wasCorrect, diff);
      topicsTouched.add(question.topic);
      results.push({
        question_id: question.id, topic: question.topic, type: "coding", difficulty: diff,
        prompt: question.problem_statement, language: answer.language, code: answer.code,
        correct: wasCorrect, marks: codingResult.configured ? Math.round(qMarks * (codingResult.passed / codingResult.total)) : 0,
        max_marks: qMarks, tests_passed: codingResult.passed, tests_total: codingResult.total,
        run_configured: codingResult.configured, run_message: codingResult.message, run_details: codingResult.details,
        explanation: null,
      });
      continue;
    }

    // MCQ / predict / debug
    wasCorrect = question.correct_option_id === answer.selected_option_id;
    typeTally[question.type].total += 1;
    difficultyTally[diff].total += 1;
    if (wasCorrect) { earnedMarks += qMarks; typeTally[question.type].correct += 1; difficultyTally[diff].correct += 1; }
    recordAttempt(userId, question.topic, wasCorrect, diff);
    topicsTouched.add(question.topic);
    const selected = question.options?.find((o) => o.id === answer.selected_option_id);
    const correct  = question.options?.find((o) => o.id === question.correct_option_id);
    results.push({
      question_id: question.id, topic: question.topic, type: question.type, difficulty: diff,
      prompt: question.prompt || question.code, code: question.code || null,
      selected_option_id: answer.selected_option_id, correct_option_id: question.correct_option_id,
      correct: wasCorrect, marks: wasCorrect ? qMarks : 0, max_marks: qMarks,
      selected_text: selected?.text || null, correct_text: correct?.text || null,
      explanation: question.explanation || null,
    });
  }

  const score  = maxMarks > 0 ? Math.round((earnedMarks / maxMarks) * 100) : 0;
  const passed = didPass(score);

  // ── Determine mode and record results ────────────────────────────────────────
  let formalAttempt = null;
  let topic = null;
  if (topicsTouched.size > 0) topic = [...topicsTouched][0];

  if (isFormal) {
    // Complete the formal attempt on the backend (authoritative)
    formalAttempt = completeFormalAttempt(userId, attempt_id, score, passed);
    if (!formalAttempt) {
      return res.status(404).json({ error: "Attempt not found or already submitted" });
    }
    mode = formalAttempt.isReassessment ? "reassessment" : "formal";
    for (const topicId of topicsTouched) {
      recordQuizResult(userId, topicId, score, formalAttempt.difficulty || "all", mode);
    }
    // If passed, clear any recovery state for this topic
    if (passed) resetRecoveryIfPassed(userId, topic);
  } else {
    // Practice mode
    for (const topicId of topicsTouched) {
      recordQuizResult(userId, topicId, score, "all", "practice");
      // Update recovery progress if in recovery and scored high enough
      if (isInRecovery(userId, topicId) && score >= RECOVERY_PRACTICE_MIN_SCORE) {
        recordRecoveryPractice(userId, topicId, score);
      }
    }
  }

  // ── Build response ──────────────────────────────────────────────────────────
  const allProgress = getProgressForUser(userId);
  const progressMap  = Object.fromEntries(allProgress.map((p) => [p.topic, p]));

  const topic_breakdown = [...topicsTouched].map((topicId) => {
    const p = progressMap[topicId] || {};
    return {
      topic:           topicId,
      mastery_score:   p.mastery_score   ?? 0,
      best_score:      p.best_score      ?? score,
      latest_score:    score,
      attempts:        p.attempts        ?? (isFormal ? 1 : 0),
      passed_attempts: p.passed_attempts ?? (passed && isFormal ? 1 : 0),
      failed_attempts: p.failed_attempts ?? (!passed && isFormal ? 1 : 0),
      practice_count:  p.practice_count  ?? 0,
      level:           getLevel(p.mastery_score ?? 0),
      status:          getTopicStatus(userId, topicId),
    };
  });

  const difficulty_breakdown = Object.entries(difficultyTally)
    .filter(([, v]) => v.total > 0)
    .map(([diff, v]) => ({ difficulty: diff, correct: v.correct, total: v.total, percent: Math.round((v.correct / v.total) * 100) }));

  const type_breakdown = Object.entries(typeTally)
    .filter(([, v]) => v.total > 0)
    .map(([t, v]) => ({ type: t, correct: v.correct, total: v.total, percent: Math.round((v.correct / v.total) * 100) }));

  const response = {
    score, passed,
    pass_mark:            PASS_THRESHOLD,
    earned_marks:         earnedMarks,
    max_marks:            maxMarks,
    correct_count:        results.filter((r) => r.correct).length,
    incorrect_count:      results.filter((r) => !r.correct).length,
    total_questions:      answers.length,
    difficulty_breakdown,
    type_breakdown,
    topic_breakdown,
    results,
    code_exec_configured: isCodeExecConfigured(),
    mode,  // "formal" | "practice" | "reassessment"
  };

  // Add attempt context for formal submissions
  if (isFormal && formalAttempt) {
    response.attempt_id    = formalAttempt.id;
    response.attempts_used = getFormalAttemptCount(userId, formalAttempt.topic, formalAttempt.qtype, formalAttempt.difficulty);
    response.attempts_remaining = getAttemptsRemaining(userId, formalAttempt.topic, formalAttempt.qtype, formalAttempt.difficulty);
    response.in_recovery   = isInRecovery(userId, formalAttempt.topic);
    response.recovery      = getRecoveryStatus(userId, formalAttempt.topic);
    response.reassessment_remaining = getReassessmentRemaining(userId, formalAttempt.topic, formalAttempt.qtype, formalAttempt.difficulty);
  }

  res.json(response);
});

// ── GET /tests/attempts?topic=&qtype=&difficulty= ──────────────────────────────
// Returns attempt history for a specific config.
router.get("/attempts", (req, res) => {
  const topic      = req.query.topic;
  const qtype      = req.query.qtype      || "mcq";
  const difficulty = req.query.difficulty || "all";
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const userId = req.user.id;
  res.json({
    topic, qtype, difficulty,
    attempts:          getAttemptHistory(userId, topic, qtype, difficulty),
    attempts_used:    getFormalAttemptCount(userId, topic, qtype, difficulty),
    attempts_remaining: getAttemptsRemaining(userId, topic, qtype, difficulty),
    max_attempts:     MAX_FORMAL_ATTEMPTS,
    in_recovery:      isInRecovery(userId, topic),
    recovery:          getRecoveryStatus(userId, topic),
    reassessment_remaining: getReassessmentRemaining(userId, topic, qtype, difficulty),
  });
});

// ── GET /tests/recovery?topic= ────────────────────────────────────────────────
router.get("/recovery", (req, res) => {
  const topic = req.query.topic;
  if (!topic) return res.status(400).json({ error: "topic is required" });
  res.json({
    topic,
    in_recovery: isInRecovery(req.user.id, topic),
    recovery:    getRecoveryStatus(req.user.id, topic),
  });
});

// ── GET /tests/mastery ────────────────────────────────────────────────────────
router.get("/mastery", (req, res) => {
  const prog = getProgressForUser(req.user.id);
  res.json({
    mastery: prog.map((p) => ({
      topic:           p.topic,
      mastery_score:   p.mastery_score,
      best_score:      p.best_score,
      latest_score:    p.latest_score,
      attempts:        p.attempts,
      passed_attempts: p.passed_attempts,
      failed_attempts: p.failed_attempts,
      practice_count:  p.practice_count,
      level:           p.level,
      status:          p.status,
    })),
  });
});

// ── GET /tests/topics ─────────────────────────────────────────────────────────
router.get("/topics", (req, res) => {
  const topicMap = {};
  for (const q of questions) {
    if (!topicMap[q.topic]) topicMap[q.topic] = { easy: 0, medium: 0, hard: 0, total: 0 };
    topicMap[q.topic][q.difficulty] += 1;
    topicMap[q.topic].total += 1;
  }
  res.json({ topics: Object.entries(topicMap).map(([topic, counts]) => ({ topic, ...counts })) });
});

export default router;
