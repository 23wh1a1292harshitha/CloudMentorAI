/**
 * RecoveryPanel — shown when a student has exhausted all 3 formal attempts
 * without passing a topic+qtype+difficulty config.
 *
 * Props:
 *   token       : JWT
 *   topic       : topic id string (e.g. "variables")
 *   topicLabel  : display name (e.g. "Variables & Data Types")
 *   topicIcon   : emoji
 *   qtype       : assessment type (e.g. "mcq")
 *   difficulty  : difficulty (e.g. "hard")
 *   attemptHistory : array of completed formal attempts with scores
 *   lastResults : results[] from most recent submission (for weak concept analysis)
 *   recovery    : { practicePassed, practiceTarget, practiceMinScore, complete }
 *   reassessmentRemaining : number
 *   passThreshold : number (70)
 *   onStartPractice   : fn() — starts a practice quiz
 *   onStartReassessment : fn() — starts reassessment (only if eligible)
 *   onBack        : fn() — returns to topic screen
 */

import { useState, useEffect } from "react";
import { fetchWeakConceptHelp, fetchNextQuiz, submitQuiz } from "../api.js";
import styles from "./RecoveryPanel.module.css";

const STEP_LABEL = { 1: "1st", 2: "2nd", 3: "3rd" };

export default function RecoveryPanel({
  token,
  topic,
  topicLabel,
  topicIcon,
  qtype,
  difficulty,
  attemptHistory = [],
  lastResults = [],
  recovery = {},
  reassessmentRemaining = 0,
  passThreshold = 70,
  onStartPractice,
  onStartReassessment,
  onBack,
}) {
  const [activeTab, setActiveTab]   = useState("overview"); // overview | practice | checklist
  const [aiHelp,    setAiHelp]      = useState("");
  const [aiLoading, setAiLoading]   = useState(false);
  const [practiceState, setPracticeState] = useState("idle"); // idle | loading | taking | submitting | done
  const [practiceQuiz,  setPracticeQuiz]  = useState(null);
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceResult,  setPracticeResult]  = useState(null);
  const [practiceError,   setPracticeError]   = useState("");

  const formalAttempts = attemptHistory.filter(a => !a.isReassessment);
  const bestScore = formalAttempts.reduce((best, a) => Math.max(best, a.score ?? 0), 0);
  const latestScore = formalAttempts.length > 0 ? (formalAttempts[formalAttempts.length - 1].score ?? 0) : 0;
  const wrongAnswers = lastResults.filter(r => !r.correct);
  const passedThisRecovery = recovery.practicePassed ?? 0;
  const practiceTarget = recovery.practiceTarget ?? 3;
  const recoveryComplete = recovery.complete === true;
  const canReassess = recoveryComplete && reassessmentRemaining > 0;

  // Load AI weak-concept help on mount if we have wrong answers
  useEffect(() => {
    if (wrongAnswers.length === 0) return;
    setAiLoading(true);
    fetchWeakConceptHelp(token, {
      topic,
      results: lastResults.map(r => ({
        prompt: r.prompt || r.code || "",
        correct: r.correct,
        selected_text: r.selected_text,
        correct_text: r.correct_text,
        difficulty: r.difficulty,
        type: r.type,
      })),
    })
      .then(reply => { setAiHelp(reply); setAiLoading(false); })
      .catch(() => { setAiHelp("Review the concepts you got wrong and practice them one at a time."); setAiLoading(false); });
  }, []);

  // ── Practice flow ──────────────────────────────────────────────────────────
  async function startPracticeQuiz() {
    setPracticeError("");
    setPracticeState("loading");
    try {
      const data = await fetchNextQuiz(token, topic, "easy", qtype);
      setPracticeQuiz(data);
      setPracticeAnswers({});
      setPracticeResult(null);
      setPracticeState("taking");
    } catch (err) {
      setPracticeError(err.message);
      setPracticeState("idle");
    }
  }

  function pickPracticeAnswer(qId, oId) {
    setPracticeAnswers(prev => ({ ...prev, [qId]: oId }));
  }

  async function submitPractice() {
    const unanswered = practiceQuiz.questions.filter(q => !practiceAnswers[q.id]);
    if (unanswered.length) { setPracticeError("Answer all questions before submitting."); return; }
    setPracticeState("submitting");
    const payload = practiceQuiz.questions.map(q => ({
      question_id: q.id,
      selected_option_id: practiceAnswers[q.id],
    }));
    try {
      const data = await submitQuiz(token, { answers: payload }); // no attempt_id = practice
      setPracticeResult(data);
      setPracticeState("done");
    } catch (err) {
      setPracticeError(err.message);
      setPracticeState("taking");
    }
  }

  // ── Render helpers ──────────────────────────────────────────────────────────
  function ScorePill({ score }) {
    const passed = score >= passThreshold;
    return (
      <span className={`${styles.scorePill} ${passed ? styles.scorePillPass : styles.scorePillFail}`}>
        {score}%
      </span>
    );
  }

  function ChecklistItem({ done, label, sub }) {
    return (
      <div className={`${styles.checklistItem} ${done ? styles.checklistDone : ""}`}>
        <span className={styles.checkIcon}>{done ? "✓" : "○"}</span>
        <div>
          <span className={styles.checkLabel}>{label}</span>
          {sub && <p className={styles.checkSub}>{sub}</p>}
        </div>
      </div>
    );
  }

  // ── Recovery header ────────────────────────────────────────────────────────
  const Header = () => (
    <div className={styles.header}>
      <button className={styles.backLink} onClick={onBack}>← Back to topic</button>
      <div className={styles.headerBadge}>🔄 Recovery Mode</div>
      <div className={styles.headerContent}>
        <span className={styles.topicIcon}>{topicIcon}</span>
        <div>
          <h2 className={styles.topicTitle}>{topicLabel}</h2>
          <p className={styles.topicSub}>{qtype.toUpperCase()} · {difficulty === "all" ? "Mixed" : difficulty}</p>
        </div>
      </div>
      <p className={styles.headerMsg}>
        You've completed your 3 regular attempts. Review your weak concepts, complete targeted practice, and unlock your reassessment.
      </p>
      {/* Score strip */}
      <div className={styles.scoreStrip}>
        {formalAttempts.map((a, i) => (
          <div key={a.id} className={styles.scoreStripItem}>
            <span className={styles.stripLabel}>Attempt {i + 1}</span>
            <ScorePill score={a.score ?? 0} />
          </div>
        ))}
        <div className={styles.scoreStripItem}>
          <span className={styles.stripLabel}>Best</span>
          <span className={styles.stripBest}>{bestScore}%</span>
        </div>
        <div className={styles.scoreStripItem}>
          <span className={styles.stripLabel}>Pass mark</span>
          <span className={styles.stripMark}>{passThreshold}%</span>
        </div>
      </div>
    </div>
  );

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const Tabs = () => (
    <div className={styles.tabs}>
      {[
        { id: "overview",  label: "Overview",  icon: "📊" },
        { id: "practice",  label: "Practice",  icon: "🎯" },
        { id: "checklist", label: "Checklist", icon: "✅" },
      ].map(t => (
        <button
          key={t.id}
          className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
          onClick={() => setActiveTab(t.id)}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );

  // ── Overview tab ───────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div className={styles.tabContent}>

      {/* AI weak-concept analysis */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>💬 What to focus on</h3>
        {aiLoading ? (
          <div className={styles.aiLoading}>AI Buddy is analysing your results…</div>
        ) : aiHelp ? (
          <div className={styles.aiBox}>{aiHelp}</div>
        ) : (
          <p className={styles.muted}>No specific weak concepts detected from your latest attempt.</p>
        )}
      </section>

      {/* Wrong answers from last attempt */}
      {wrongAnswers.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>❌ Questions you got wrong (last attempt)</h3>
          {wrongAnswers.map((r, i) => (
            <div key={r.question_id} className={styles.wrongCard}>
              <div className={styles.wrongHead}>
                <span className={styles.wrongNum}>Q{i + 1}</span>
                <span className={`${styles.diffBadge} ${styles["diff_" + r.difficulty]}`}>{r.difficulty}</span>
              </div>
              {r.code && <pre className={styles.codeSnippet}>{r.code}</pre>}
              <p className={styles.wrongPrompt}>{r.prompt}</p>
              <div className={styles.wrongAnswers}>
                <span className={styles.wrongAns}>✗ You answered: {r.selected_text || "—"}</span>
                <span className={styles.rightAns}>✓ Correct: {r.correct_text}</span>
              </div>
              {r.explanation && (
                <p className={styles.explanation}>💡 {r.explanation}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Attempt history */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📋 Attempt history</h3>
        <div className={styles.attemptTable}>
          {attemptHistory.map((a, i) => (
            <div key={a.id} className={styles.attemptRow}>
              <span className={styles.attemptNum}>{a.isReassessment ? "Reassessment" : `Attempt ${i + 1}`}</span>
              <ScorePill score={a.score ?? 0} />
              <span className={styles.attemptDate}>
                {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : "In progress"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <div className={styles.ctaRow}>
        <button className={styles.ctaBtnPrimary} onClick={() => setActiveTab("practice")}>
          🎯 Start Practice
        </button>
        <button className={styles.ctaBtnSecondary} onClick={() => setActiveTab("checklist")}>
          ✅ View Recovery Checklist
        </button>
      </div>
    </div>
  );

  // ── Practice tab ───────────────────────────────────────────────────────────
  const PracticeTab = () => {
    if (practiceState === "idle" || practiceState === "loading") {
      return (
        <div className={styles.tabContent}>
          <div className={styles.practiceIntro}>
            <h3 className={styles.sectionTitle}>🎯 Targeted Practice</h3>
            <p className={styles.muted}>
              Practice quizzes start easy and build up. They don't count against your formal attempt limit.
              Complete {practiceTarget - passedThisRecovery} more practice quiz{practiceTarget - passedThisRecovery !== 1 ? "zes" : ""} with {recovery.practiceMinScore ?? 50}%+ to unlock your reassessment.
            </p>
            <div className={styles.practiceProgress}>
              <div className={styles.practiceProgressTrack}>
                <div
                  className={styles.practiceProgressFill}
                  style={{ width: `${Math.min(100, (passedThisRecovery / practiceTarget) * 100)}%` }}
                />
              </div>
              <span className={styles.practiceProgressLabel}>{passedThisRecovery}/{practiceTarget} practice quizzes completed</span>
            </div>
          </div>
          {practiceError && <p className={styles.error}>{practiceError}</p>}
          <button
            className={styles.ctaBtnPrimary}
            onClick={startPracticeQuiz}
            disabled={practiceState === "loading"}
          >
            {practiceState === "loading" ? "Loading practice quiz…" : "▶ Start Practice Quiz"}
          </button>
          {onStartPractice && (
            <p className={styles.muted} style={{ marginTop: 8 }}>
              You can also go back to use the full practice mode with custom difficulty settings.
            </p>
          )}
        </div>
      );
    }

    if (practiceState === "taking" || practiceState === "submitting") {
      const answered = Object.keys(practiceAnswers).length;
      const total = practiceQuiz.questions.length;
      return (
        <div className={styles.tabContent}>
          <div className={styles.practiceHeader}>
            <span className={styles.practiceBadge}>🎯 Practice — no attempts used</span>
            <span className={styles.muted}>{answered}/{total} answered</span>
          </div>
          {practiceQuiz.questions.map((q, idx) => (
            <div key={q.id} className={`${styles.qCard} ${practiceAnswers[q.id] ? styles.qCardAnswered : ""}`}>
              <div className={styles.qHead}>
                <span className={styles.qNum}>Q{idx + 1}</span>
                <span className={`${styles.diffBadge} ${styles["diff_" + q.difficulty]}`}>{q.difficulty}</span>
              </div>
              {q.code && <pre className={styles.codeSnippet}>{q.code}</pre>}
              <p className={styles.qPrompt}>{q.prompt}</p>
              <div className={styles.qOptions}>
                {(q.options || []).map(o => (
                  <label key={o.id} className={`${styles.qOption} ${practiceAnswers[q.id] === o.id ? styles.qOptionSel : ""}`}>
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={practiceAnswers[q.id] === o.id}
                      onChange={() => pickPracticeAnswer(q.id, o.id)}
                      disabled={practiceState === "submitting"}
                    />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {practiceError && <p className={styles.error}>{practiceError}</p>}
          <div className={styles.submitRow}>
            <button className={styles.ctaBtnSecondary} onClick={() => setPracticeState("idle")}>← Cancel</button>
            <button className={styles.ctaBtnPrimary} onClick={submitPractice} disabled={practiceState === "submitting"}>
              {practiceState === "submitting" ? "Submitting…" : `Submit (${answered}/${total})`}
            </button>
          </div>
        </div>
      );
    }

    if (practiceState === "done" && practiceResult) {
      const passed = practiceResult.score >= passThreshold;
      const newPassed = passedThisRecovery + (practiceResult.score >= (recovery.practiceMinScore ?? 50) ? 1 : 0);
      return (
        <div className={styles.tabContent}>
          <div className={`${styles.practiceResultBanner} ${passed ? styles.prPass : styles.prFail}`}>
            <span className={styles.prScore}>{practiceResult.score}%</span>
            <div>
              <p className={styles.prVerdict}>{passed ? "✓ Good work!" : "Keep going!"}</p>
              <p className={styles.prDetail}>{practiceResult.correct_count}/{practiceResult.total_questions} correct</p>
            </div>
          </div>

          {/* Show immediate explanations for wrong answers */}
          {(practiceResult.results || []).filter(r => !r.correct).map((r, i) => (
            <div key={r.question_id} className={styles.wrongCard} style={{ marginTop: i === 0 ? 16 : 8 }}>
              <p className={styles.wrongPrompt}>{r.prompt}</p>
              <div className={styles.wrongAnswers}>
                <span className={styles.wrongAns}>✗ {r.selected_text || "—"}</span>
                <span className={styles.rightAns}>✓ {r.correct_text}</span>
              </div>
              {r.explanation && <p className={styles.explanation}>💡 {r.explanation}</p>}
            </div>
          ))}

          <div className={styles.practiceProgress} style={{ marginTop: 16 }}>
            <div className={styles.practiceProgressTrack}>
              <div className={styles.practiceProgressFill} style={{ width: `${Math.min(100, (newPassed / practiceTarget) * 100)}%` }} />
            </div>
            <span className={styles.practiceProgressLabel}>{newPassed}/{practiceTarget} practice quizzes completed</span>
          </div>

          <div className={styles.submitRow} style={{ marginTop: 14 }}>
            <button className={styles.ctaBtnSecondary} onClick={() => setPracticeState("idle")}>
              ← Back
            </button>
            <button className={styles.ctaBtnPrimary} onClick={() => { setPracticeState("idle"); setPracticeResult(null); }}>
              Take Another Practice →
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  // ── Checklist tab ──────────────────────────────────────────────────────────
  const ChecklistTab = () => (
    <div className={styles.tabContent}>
      <h3 className={styles.sectionTitle}>Recovery Checklist</h3>
      <p className={styles.muted}>Complete all requirements to unlock your reassessment attempt.</p>

      <div className={styles.checklist}>
        <ChecklistItem
          done={formalAttempts.length >= 3}
          label="Complete 3 formal assessment attempts"
          sub={`${formalAttempts.length}/3 completed`}
        />
        <ChecklistItem
          done={wrongAnswers.length > 0 || aiHelp.length > 0}
          label="Review weak concepts identified by AI Buddy"
          sub={wrongAnswers.length > 0 ? `${wrongAnswers.length} concept${wrongAnswers.length !== 1 ? "s" : ""} to review — see Overview tab` : "No specific weak areas detected"}
        />
        <ChecklistItem
          done={passedThisRecovery >= practiceTarget}
          label={`Complete ${practiceTarget} practice quizzes with ${recovery.practiceMinScore ?? 50}%+`}
          sub={`${passedThisRecovery}/${practiceTarget} completed`}
        />
      </div>

      {/* Reassessment status */}
      <div className={`${styles.reassessCard} ${canReassess ? styles.reassessCardOpen : styles.reassessCardLocked}`}>
        {canReassess ? (
          <>
            <p className={styles.reassessTitle}>🎉 You're eligible for a reassessment!</p>
            <p className={styles.reassessSub}>A fresh set of questions will be generated at the same difficulty level.</p>
            <button className={styles.reassessBtn} onClick={onStartReassessment}>
              Take Reassessment ({reassessmentRemaining} attempt{reassessmentRemaining !== 1 ? "s" : ""} remaining)
            </button>
          </>
        ) : recoveryComplete && reassessmentRemaining <= 0 ? (
          <>
            <p className={styles.reassessTitle}>Reassessment attempts used</p>
            <p className={styles.reassessSub}>You've used your reassessment attempt. Contact your instructor if you need further assistance.</p>
          </>
        ) : (
          <>
            <p className={styles.reassessTitle}>🔒 Reassessment locked</p>
            <p className={styles.reassessSub}>
              Complete the checklist requirements above. {passedThisRecovery < practiceTarget
                ? `${practiceTarget - passedThisRecovery} more practice quiz${practiceTarget - passedThisRecovery !== 1 ? "zes" : ""} needed.`
                : "All requirements met — reassessment unlocking…"}
            </p>
            <button className={styles.ctaBtnPrimary} onClick={() => setActiveTab("practice")} style={{ marginTop: 12 }}>
              🎯 Go to Practice
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      <Header />
      <Tabs />
      {activeTab === "overview"  && <OverviewTab />}
      {activeTab === "practice"  && <PracticeTab />}
      {activeTab === "checklist" && <ChecklistTab />}
    </div>
  );
}
