// ── Code execution runner ─────────────────────────────────────────────────────
// SECURITY: Student code is NEVER executed on this application server.
// Execution only happens when a secure isolated sandbox is configured via env:
//   CODE_EXEC_ENABLED=true
//   CODE_SANDBOX_URL=http://localhost:8080/execute   (Judge0 / custom sandbox)
//
// If not configured, every run returns { configured:false } so the UI can show
// a clear message. This deliberately avoids "pretending" execution works.

import { spawn } from "child_process";

export function isCodeExecConfigured() {
  return (
    process.env.CODE_EXEC_ENABLED === "true" &&
    !!process.env.CODE_SANDBOX_URL
  );
}

/**
 * Run student code against a set of test cases via the configured sandbox.
 * @param {string} language  "python" | "java"
 * @param {string} code      student source code
 * @param {Array}  testCases  [{ input, output }]
 * @returns {Promise<{configured, passed, total, details, message?}>}
 */
export async function runCode(language, code, testCases) {
  if (!isCodeExecConfigured()) {
    return {
      configured: false,
      passed: 0,
      total: testCases.length,
      details: [],
      message:
        "Code execution sandbox is not configured. Set CODE_EXEC_ENABLED=true and CODE_SANDBOX_URL in .env to enable. Submissions are saved but not executed.",
    };
  }

  // ── Sandbox call ──────────────────────────────────────────────────────────
  // The sandbox is expected to accept { language, code, testCases } and return
  // { results: [{ passed, expected, actual, stderr, status }] }.
  try {
    const res = await fetch(process.env.CODE_SANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code, testCases }),
      // Don't hang forever — give the sandbox a hard cap.
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        configured: true,
        passed: 0,
        total: testCases.length,
        details: [],
        message: `Sandbox error: ${data.error || res.status}`,
      };
    }
    const details = data.results || [];
    const passed = details.filter((d) => d.passed).length;
    return { configured: true, passed, total: testCases.length, details };
  } catch (err) {
    return {
      configured: true,
      passed: 0,
      total: testCases.length,
      details: [],
      message: `Could not reach sandbox: ${err.message}`,
    };
  }
}
