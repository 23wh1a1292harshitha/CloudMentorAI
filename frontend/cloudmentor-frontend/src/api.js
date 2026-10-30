// All API calls go through Vite's dev proxy (see vite.config.js)
// /api/buddy/* → http://localhost:4000/*
// /api/tests/*  → http://localhost:4001/*

function authHeaders(token) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signup({ name, email, password }) {
  const res = await fetch("/api/buddy/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "student" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data; // { token, user }
}

export async function login({ email, password }) {
  const res = await fetch("/api/buddy/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data; // { token, user }
}

// ── Learning Paths ────────────────────────────────────────────────────────────

export async function fetchPaths(token) {
  const res = await fetch("/api/tests/paths", { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load learning paths");
  return data; // { paths, pass_threshold }
}

export async function fetchPath(token, pathId) {
  const res = await fetch(`/api/tests/paths/${pathId}`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load path");
  return data; // { path, pass_threshold }
}

export async function checkTopicAccess(token, topicId) {
  const res = await fetch(`/api/tests/paths/topic/${topicId}/check`, { headers: authHeaders(token) });
  const data = await res.json();
  return data; // { unlocked, prereq_progress?, error? }
}

export async function fetchTopicHelp(token, { topic, status, prereq_progress, best_score }) {
  const res = await fetch("/api/buddy/buddy/topic-help", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ topic, status, prereq_progress, best_score }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not get topic help");
  return data.reply;
}

// ── Formal Assessment (attempt-limited) ───────────────────────────────────────

export async function startAssessment(token, { topic, qtype, difficulty, isReassessment }) {
  const res = await fetch("/api/tests/tests/start", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ topic, qtype, difficulty, isReassessment }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not start assessment");
  return data; // { attempt_id, questions, pass_mark, attempts_used, attempts_remaining, ... }
}

export async function fetchAttempts(token, { topic, qtype, difficulty }) {
  const url = `/api/tests/tests/attempts?topic=${encodeURIComponent(topic)}&qtype=${qtype || "mcq"}&difficulty=${difficulty || "all"}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load attempts");
  return data; // { attempts, attempts_used, attempts_remaining, max_attempts, recovery, ... }
}

export async function fetchRecovery(token, topic) {
  const res = await fetch(`/api/tests/tests/recovery?topic=${encodeURIComponent(topic)}`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load recovery status");
  return data; // { topic, in_recovery, recovery: {...} }
}

// ── Practice (unlimited) ──────────────────────────────────────────────────────

export async function fetchNextQuiz(token, topic = null, difficulty = null, type = null) {
  const params = new URLSearchParams();
  if (topic)      params.set("topic", topic);
  if (difficulty) params.set("difficulty", difficulty);
  if (type)       params.set("type", type);
  const qs = params.toString();
  const url = "/api/tests/tests/next" + (qs ? `?${qs}` : "");
  const res = await fetch(url, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load quiz");
  return data; // { test_id, questions[], pass_mark, is_practice }
}

export async function fetchQuestionTypes(token, topic) {
  const res = await fetch(`/api/tests/tests/types?topic=${encodeURIComponent(topic)}`, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load question types");
  return data.types; // [{ type, easy, medium, hard, total }]
}

export async function runCode(token, { question_id, language, code }) {
  const res = await fetch("/api/tests/tests/run-code", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ question_id, language, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not run code");
  return data; // { configured, passed, total, details, message, is_sample }
}

export async function submitQuiz(token, payload) {
  // payload can be { answers } for practice or { attempt_id, answers } for formal
  const res = await fetch("/api/tests/tests/submit", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Submit failed");
  return data; // { score, topic_breakdown, results, mode, ... }
}

export async function fetchMastery(token) {
  const res = await fetch("/api/tests/tests/mastery", { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load mastery");
  return data.mastery; // []
}

// ── AI Buddy ──────────────────────────────────────────────────────────────────

export async function fetchRecommendation(token) {
  const res = await fetch("/api/buddy/buddy/recommendation", { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load recommendation");
  return data; // { topic, reason }
}

export async function fetchWeeklyReport(token) {
  const res = await fetch("/api/buddy/buddy/weekly-report", { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load report");
  return data; // { summary_text, next_week_plan }
}

export async function sendChatMessage(token, message) {
  const res = await fetch("/api/buddy/buddy/chat", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Chat failed");
  return data; // { reply, escalate_to_mentor, suggested_topic? }
}

export async function explainMistakes(token, missed) {
  const res = await fetch("/api/buddy/buddy/explain-mistakes", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ missed }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not get explanations");
  return data.explanations; // string
}

export async function fetchWeakConceptHelp(token, { topic, results }) {
  const res = await fetch("/api/buddy/buddy/weak-concepts", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ topic, results }),
  });
  const data = await res.json();
  if (!res.ok) return "Practice the questions you got wrong and revisit the topic fundamentals.";
  return data.reply;
}

// ── Health ────────────────────────────────────────────────────────────────────

export async function healthCheck() {
  const [buddy, tests] = await Promise.allSettled([
    fetch("/api/buddy/health").then((r) => r.json()),
    fetch("/api/tests/health").then((r) => r.json()),
  ]);
  return {
    buddy: buddy.status === "fulfilled" ? buddy.value : null,
    tests: tests.status === "fulfilled" ? tests.value : null,
  };
}
