/**
 * LearningPathsPanel — redesigned flow
 *
 * Views:
 *   "paths"       → grid of path cards
 *   "topics"      → topic list within a path
 *   "setup"       → assessment type + difficulty selection (renamed from "difficulty")
 *   "quiz"        → taking the quiz
 *   "result"      → quiz result screen
 *   "recovery"    → Recovery Mode dashboard (RecoveryPanel)
 *
 * Design improvements over previous version:
 *   - Locked topics are NOT clickable — no confusing navigation into the flow
 *   - Recovery state is surfaced immediately when attempts are exhausted
 *   - Attempt counter shown before and during the quiz
 *   - Assessment type + difficulty unified on one screen
 *   - Wider result view with clear next-step CTA
 *   - Dead code removed (no dead API imports)
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchPaths,
  startAssessment,
  fetchNextQuiz,
  submitQuiz,
  explainMistakes,
  fetchTopicHelp,
  runCode,
  fetchAttempts,
  fetchRecovery,
} from "../api.js";
import MasteryBar from "../components/MasteryBar.jsx";
import RecoveryPanel from "./RecoveryPanel.jsx";
import styles from "./LearningPathsPanel.module.css";

// ── Design constants ──────────────────────────────────────────────────────────
const DIFFICULTIES = [
  { value: "all",    label: "All Levels", desc: "Mixed difficulty" },
  { value: "easy",   label: "Easy",       desc: "Beginner-friendly" },
  { value: "medium", label: "Medium",     desc: "Intermediate" },
  { value: "hard",   label: "Hard",       desc: "Advanced" },
];

const TYPE_META = {
  mcq:            { label: "MCQs",           icon: "☑️",  desc: "Multiple-choice questions" },
  predict_output: { label: "Predict Output", icon: "🔮",  desc: "Predict code output" },
  debugging:      { label: "Debugging",      icon: "🐛",  desc: "Find the bug" },
  coding:         { label: "Coding",         icon: "💻",  desc: "Write code" },
};

const STATUS_META = {
  locked:      { label: "Locked",      icon: "🔒", color: "statusLocked"     },
  available:   { label: "Available",   icon: "▶",  color: "statusAvailable"  },
  in_progress: { label: "In Progress", icon: "⏳", color: "statusInProgress" },
  completed:   { label: "Completed",   icon: "✅", color: "statusCompleted"  },
};

function levelCls(level) {
  if (level === "Advanced")     return styles.lvlAdvanced;
  if (level === "Intermediate") return styles.lvlIntermediate;
  return styles.lvlBeginner;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LearningPathsPanel({ token }) {
  // ── Navigation state ───────────────────────────────────────────────────────
  const [view,       setView]       = useState("paths");
  const [activePath, setActivePath] = useState(null);
  const [activeTopic,setActiveTopic]= useState(null);

  // ── Path / topic list ──────────────────────────────────────────────────────
  const [paths,          setPaths]          = useState([]);
  const [passThreshold,  setPassThreshold]  = useState(70);
  const [pathsLoading,   setPathsLoading]   = useState(true);
  const [pathsError,     setPathsError]     = useState("");

  // ── Setup screen (type + difficulty) ──────────────────────────────────────
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState("all");
  const [setupError,   setSetupError]   = useState("");
  const [setupLoading, setSetupLoading] = useState(false);
  const [topicHelp,    setTopicHelp]    = useState("");
  const [helpLoading,  setHelpLoading]  = useState(false);

  // ── Quiz state ─────────────────────────────────────────────────────────────
  const [quiz,       setQuiz]       = useState(null);
  const [answers,    setAnswers]    = useState({});
  const [codeByQid,  setCodeByQid]  = useState({});
  const [codeLang,   setCodeLang]   = useState("python");
  const [runResults, setRunResults] = useState({});
  const [running,    setRunning]    = useState(null);
  const [quizError,  setQuizError]  = useState("");
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [attemptId,  setAttemptId]  = useState(null);
  const [attemptsInfo,setAttemptsInfo] = useState(null);

  // ── Result state ───────────────────────────────────────────────────────────
  const [result,      setResult]      = useState(null);
  const [explanations,setExplanations]= useState("");
  const [explLoading, setExplLoading] = useState(false);

  // ── Recovery state ─────────────────────────────────────────────────────────
  const [recoveryData, setRecoveryData] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);

  // ── Load paths ─────────────────────────────────────────────────────────────
  const loadPaths = useCallback(async () => {
    setPathsLoading(true);
    setPathsError("");
    try {
      const data = await fetchPaths(token);
      setPaths(data.paths);
      setPassThreshold(data.pass_threshold);
    } catch (err) {
      setPathsError(err.message);
    } finally {
      setPathsLoading(false);
    }
  }, [token]);

  useEffect(() => { loadPaths(); }, [loadPaths]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  function goToPaths() {
    setView("paths"); setActivePath(null); setActiveTopic(null);
    setTopicHelp(""); setSetupError("");
  }

  function goToTopics() {
    setView("topics"); setActiveTopic(null);
    setTopicHelp(""); setSetupError("");
  }

  function goToSetup() {
    setView("setup"); setSetupError("");
    setResult(null); setExplanations("");
  }

  async function openTopic(topic) {
    if (topic.status === "locked") return; // hard block — don't navigate
    setActiveTopic(topic);
    setSelectedType(null);
    setSelectedDiff("all");
    setSetupError("");
    setTopicHelp("");
    setView("setup");

    // AI help for in-progress topics
    if (topic.status === "in_progress") {
      setHelpLoading(true);
      fetchTopicHelp(token, {
        topic: topic.id, status: topic.status,
        prereq_progress: topic.prereq_progress, best_score: topic.best_score ?? 0,
      })
        .then(r => { setTopicHelp(r); setHelpLoading(false); })
        .catch(() => setHelpLoading(false));
    }
  }

  // ── Start formal assessment ────────────────────────────────────────────────
  async function startQuiz() {
    setSetupError("");
    setSetupLoading(true);
    try {
      const data = await startAssessment(token, {
        topic: activeTopic.id,
        qtype: selectedType || "mcq",
        difficulty: selectedDiff,
      });
      if (!data.questions?.length) {
        setSetupError("No questions available for this combination. Try a different type or difficulty.");
        return;
      }
      setQuiz(data);
      setAttemptId(data.attempt_id);
      setAttemptsInfo({ used: data.attempts_used, remaining: data.attempts_remaining, max: data.max_attempts });
      setAnswers({}); setCodeByQid({}); setRunResults({});
      const fc = data.questions.find(q => q.type === "coding");
      if (fc?.languages?.[0]) setCodeLang(fc.languages[0]);
      setView("quiz");
    } catch (err) {
      // Handle attempt exhaustion — transition to recovery
      if (err.message.includes("Maximum formal") || err.message.includes("attempts")) {
        await loadRecoveryData();
      } else {
        setSetupError(err.message);
      }
    } finally {
      setSetupLoading(false);
    }
  }

  async function loadRecoveryData() {
    try {
      const [recData, histData] = await Promise.all([
        fetchRecovery(token, activeTopic.id),
        fetchAttempts(token, {
          topic: activeTopic.id,
          qtype: selectedType || "mcq",
          difficulty: selectedDiff,
        }),
      ]);
      setRecoveryData(recData.recovery);
      setAttemptHistory(histData.attempts || []);
      setAttemptsInfo({
        used: histData.attempts_used,
        remaining: histData.attempts_remaining,
        max: histData.max_attempts,
        reassessmentRemaining: histData.reassessment_remaining,
      });
      setView("recovery");
    } catch (e) {
      setSetupError("Could not load recovery status: " + e.message);
    }
  }

  // ── Quiz interaction ───────────────────────────────────────────────────────
  function pickAnswer(qId, oId) { setAnswers(p => ({ ...p, [qId]: oId })); }
  function editCode(qId, code)  { setCodeByQid(p => ({ ...p, [qId]: code })); }

  async function handleRunCode(qId) {
    setRunning(qId);
    try {
      const r = await runCode(token, { question_id: qId, language: codeLang, code: codeByQid[qId] || "" });
      setRunResults(p => ({ ...p, [qId]: r }));
    } catch (err) {
      setRunResults(p => ({ ...p, [qId]: { configured: false, message: err.message } }));
    } finally { setRunning(null); }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const unanswered = quiz.questions.filter(q =>
      q.type === "coding" ? !codeByQid[q.id]?.trim() : !answers[q.id]
    );
    if (unanswered.length) { setQuizError(`Answer all ${quiz.questions.length} questions first.`); return; }
    setQuizError(""); setQuizSubmitting(true);

    const payload = quiz.questions.map(q =>
      q.type === "coding"
        ? { question_id: q.id, language: codeLang, code: codeByQid[q.id] || "" }
        : { question_id: q.id, selected_option_id: answers[q.id] }
    );

    try {
      const data = await submitQuiz(token, { attempt_id: attemptId, answers: payload });
      setResult(data);

      if (data.attempts_used !== undefined) {
        setAttemptsInfo(p => ({
          ...p, used: data.attempts_used, remaining: data.attempts_remaining,
          in_recovery: data.in_recovery, recovery: data.recovery,
          reassessmentRemaining: data.reassessment_remaining,
        }));
      }

      // If failed and no attempts remaining, load recovery data
      if (!data.passed && data.attempts_remaining === 0) {
        try {
          const [recData, histData] = await Promise.all([
            fetchRecovery(token, activeTopic.id),
            fetchAttempts(token, { topic: activeTopic.id, qtype: selectedType || "mcq", difficulty: selectedDiff }),
          ]);
          setRecoveryData(recData.recovery);
          setAttemptHistory(histData.attempts || []);
        } catch { /* recovery data will be shown from attemptsInfo */ }
      }

      loadPaths();

      const missed = (data.results || []).filter(r => !r.correct && r.type !== "coding");
      if (missed.length) {
        setExplLoading(true);
        explainMistakes(token, missed.map(m => ({
          prompt: m.prompt || m.code || "", topic: m.topic,
          selected_text: m.selected_text, correct_text: m.correct_text,
        })))
          .then(e => { setExplanations(e); setExplLoading(false); })
          .catch(() => setExplLoading(false));
      }
      setView("result");
    } catch (err) {
      setQuizError(err.message);
    } finally {
      setQuizSubmitting(false);
    }
  }

  // ── Reassessment ───────────────────────────────────────────────────────────
  async function startReassessment() {
    setSetupError("");
    try {
      const data = await startAssessment(token, {
        topic: activeTopic.id,
        qtype: selectedType || "mcq",
        difficulty: selectedDiff,
        isReassessment: true,
      });
      setQuiz(data);
      setAttemptId(data.attempt_id);
      setAttemptsInfo({ used: data.attempts_used, remaining: data.attempts_remaining, max: data.max_attempts, isReassessment: true });
      setAnswers({}); setCodeByQid({}); setRunResults({});
      setView("quiz");
    } catch (err) {
      setSetupError(err.message);
    }
  }

  // ── Loading / error ────────────────────────────────────────────────────────
  if (pathsLoading) return (
    <div className={styles.centerMsg}>
      <div className={styles.spinner} aria-label="Loading" />
      <p className={styles.muted}>Loading learning paths…</p>
    </div>
  );

  if (pathsError) return (
    <div className={styles.centerMsg}>
      <p className={styles.error}>{pathsError}</p>
      <button className={styles.btnSecondary} onClick={loadPaths}>Retry</button>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: paths
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "paths") {
    return (
      <div>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Learning Paths</h1>
          <p className={styles.pageSubtitle}>Choose a path to get started. Topics unlock as you progress. Pass mark: {passThreshold}%</p>
        </div>
        <div className={styles.pathGrid}>
          {paths.map(path => {
            const pct = path.progress_pct;
            return (
              <button key={path.id} className={styles.pathCard} onClick={() => { setActivePath(path); setView("topics"); }}>
                <div className={styles.pathCardHead}>
                  <span className={styles.pathEmoji}>{path.icon}</span>
                  <div className={styles.pathMeta}>
                    <span className={styles.pathName}>{path.label}</span>
                    <span className={styles.pathDesc}>{path.description}</span>
                  </div>
                </div>
                <div className={styles.pathStats}>
                  <span className={styles.pathStat}>{path.completed_count}/{path.total_count} topics</span>
                  <span className={styles.pathStat}>{pct}% done</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFillBlue} style={{ width: `${pct}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: topics
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "topics") {
    return (
      <div>
        <nav className={styles.breadcrumb}>
          <button className={styles.breadLink} onClick={goToPaths}>All Paths</button>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{activePath.label}</span>
        </nav>

        <div className={styles.pathBanner}>
          <span className={styles.pathBannerIcon}>{activePath.icon}</span>
          <div>
            <h2 className={styles.pathBannerTitle}>{activePath.label}</h2>
            <p className={styles.pathBannerDesc}>{activePath.description}</p>
          </div>
        </div>

        <div className={styles.pathProgressRow}>
          <div className={styles.barTrack} style={{ flex: 1 }}>
            <div className={styles.barFillBlue} style={{ width: `${activePath.progress_pct}%` }} />
          </div>
          <span className={styles.muted}>{activePath.completed_count}/{activePath.total_count} completed</span>
        </div>

        <div className={styles.topicList} role="list">
          {activePath.topics.map((topic, idx) => {
            const s = STATUS_META[topic.status] || STATUS_META.available;
            const isLocked = topic.status === "locked";
            const Tag = isLocked ? "div" : "button";
            return (
              <Tag
                key={topic.id}
                role={isLocked ? "listitem" : "button"}
                className={`${styles.topicRow} ${styles[s.color]} ${isLocked ? styles.topicRowLocked : styles.topicRowClickable}`}
                onClick={isLocked ? undefined : () => openTopic(topic)}
                aria-disabled={isLocked}
              >
                <span className={styles.topicRowIcon}>{topic.icon}</span>
                <div className={styles.topicRowBody}>
                  <div className={styles.topicRowTop}>
                    <span className={styles.topicRowName}>{topic.label}</span>
                    <span className={`${styles.statusChip} ${styles[s.color]}`}>{s.icon} {s.label}</span>
                  </div>
                  <p className={styles.topicRowDesc}>{topic.description}</p>

                  {/* Prerequisites */}
                  {topic.prerequisites.length > 0 && topic.prereq_progress.length > 0 && (
                    <div className={styles.prereqRow}>
                      {topic.prereq_progress.map(p => (
                        <span key={p.topic} className={`${styles.prereqChip} ${p.met ? styles.prereqMet : styles.prereqUnmet}`}>
                          {p.met ? "✓" : "✗"} {p.label} {p.best_score}/{p.required}%
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mastery bar (attempted topics) */}
                  {topic.mastery_score !== null && !isLocked && (
                    <div style={{ marginTop: 8 }}>
                      <MasteryBar topic="" score={topic.mastery_score} attempts={topic.attempts} />
                    </div>
                  )}
                </div>
                <div className={styles.topicRowRight}>
                  {topic.counts.total > 0
                    ? <span className={styles.qBadge}>{topic.counts.total}Q</span>
                    : <span className={styles.qBadgeEmpty}>No Q</span>}
                  {topic.best_score !== null && <span className={styles.topicBest}>{topic.best_score}%</span>}
                  {!isLocked && <span className={styles.chevron}>›</span>}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: setup (assessment type + difficulty)
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "setup") {
    const s = STATUS_META[activeTopic.status] || STATUS_META.available;
    const noQuestions = activeTopic.counts.total === 0;

    return (
      <div>
        <nav className={styles.breadcrumb}>
          <button className={styles.breadLink} onClick={goToPaths}>Paths</button>
          <span className={styles.breadSep}>›</span>
          <button className={styles.breadLink} onClick={goToTopics}>{activePath.label}</button>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{activeTopic.label}</span>
        </nav>

        {/* Topic detail header */}
        <div className={styles.topicDetailHead}>
          <span className={styles.topicDetailIcon}>{activeTopic.icon}</span>
          <div className={styles.topicDetailMeta}>
            <div className={styles.topicDetailNameRow}>
              <h2 className={styles.topicDetailName}>{activeTopic.label}</h2>
              <span className={`${styles.statusChip} ${styles[s.color]}`}>{s.icon} {s.label}</span>
            </div>
            <p className={styles.topicDetailDesc}>{activeTopic.description}</p>
          </div>
        </div>

        {/* AI Buddy tip for in-progress topics */}
        {activeTopic.status === "in_progress" && (
          <div className={styles.aiBubble}>
            <span className={styles.aiBubbleIcon}>💬</span>
            <div>
              <p className={styles.aiBubbleLabel}>AI Buddy</p>
              {helpLoading
                ? <p className={styles.muted}>Thinking…</p>
                : topicHelp
                ? <p className={styles.aiBubbleText}>{topicHelp}</p>
                : null}
            </div>
          </div>
        )}

        {/* Current mastery */}
        {activeTopic.mastery_score !== null && (
          <div className={styles.masteryCard}>
            <p className={styles.masteryCardLabel}>Your current progress</p>
            <div className={styles.masteryCardRow}>
              <div style={{ flex: 1 }}>
                <MasteryBar topic={activeTopic.label} score={activeTopic.mastery_score} attempts={activeTopic.attempts} />
              </div>
              {activeTopic.level && (
                <span className={`${styles.levelBadge} ${levelCls(activeTopic.level)}`}>{activeTopic.level}</span>
              )}
            </div>
            <div className={styles.masteryStats}>
              <span>Best <b>{activeTopic.best_score}%</b></span>
              <span>Latest <b>{activeTopic.latest_score}%</b></span>
              <span>Passed <b>{activeTopic.passed_attempts}</b> / Failed <b>{activeTopic.failed_attempts}</b></span>
            </div>
          </div>
        )}

        {noQuestions ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>📭</p>
            <p className={styles.emptyTitle}>No questions available yet</p>
            <p className={styles.muted}>Questions for <b>{activeTopic.label}</b> haven't been added yet. Check back later or explore another topic.</p>
            <button className={styles.btnSecondary} onClick={goToTopics} style={{ marginTop: 12 }}>← Back to topics</button>
          </div>
        ) : (
          <>
            {/* Assessment type */}
            {activeTopic.types?.length > 0 && (
              <div className={styles.setupSection}>
                <p className={styles.setupSectionLabel}>Assessment Type <span className={styles.optional}>(optional)</span></p>
                <div className={styles.typeGrid}>
                  {activeTopic.types.map(t => {
                    const meta = TYPE_META[t.type] || { label: t.type, icon: "📝", desc: "" };
                    return (
                      <button
                        key={t.type}
                        className={`${styles.typeCard} ${selectedType === t.type ? styles.typeCardSel : ""}`}
                        onClick={() => setSelectedType(selectedType === t.type ? null : t.type)}
                      >
                        <span className={styles.typeCardIcon}>{meta.icon}</span>
                        <span className={styles.typeCardLabel}>{meta.label}</span>
                        <span className={styles.typeCardCount}>{t.total}Q</span>
                      </button>
                    );
                  })}
                </div>
                <p className={styles.setupNote}>
                  {selectedType ? `Filtered to ${TYPE_META[selectedType]?.label || selectedType} questions.` : "No type selected — quiz will include mixed types."}
                </p>
              </div>
            )}

            {/* Difficulty */}
            <div className={styles.setupSection}>
              <p className={styles.setupSectionLabel}>Difficulty</p>
              <div className={styles.diffRow}>
                {DIFFICULTIES.map(d => {
                  const count = selectedType
                    ? ((activeTopic.types || []).find(t => t.type === selectedType)?.[d.value] || 0)
                    : (d.value === "all" ? activeTopic.counts.total : activeTopic.counts[d.value]);
                  if (count === 0) return null;
                  return (
                    <button
                      key={d.value}
                      className={`${styles.diffChip} ${selectedDiff === d.value ? styles.diffChipSel : ""}`}
                      onClick={() => setSelectedDiff(d.value)}
                    >
                      <span className={styles.diffChipLabel}>{d.label}</span>
                      <span className={styles.diffChipCount}>{count === activeTopic.counts.total && d.value === "all" ? `${count} total` : `${count}Q`}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {setupError && <p className={styles.error}>{setupError}</p>}

            <button
              className={styles.btnPrimary}
              onClick={startQuiz}
              disabled={setupLoading}
            >
              {setupLoading ? "Starting…" : `Start ${activeTopic.status === "completed" ? "Revision " : ""}Quiz →`}
            </button>
          </>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: quiz
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "quiz") {
    if (!quiz) return <div className={styles.centerMsg}><div className={styles.spinner} /><p className={styles.muted}>Loading…</p></div>;

    const answered = Object.keys(answers).length + Object.keys(codeByQid).length;
    const total    = quiz.questions.length;
    const isReassessment = attemptsInfo?.isReassessment;

    return (
      <div>
        {/* Quiz top bar */}
        <div className={styles.quizTopBar}>
          <div className={styles.quizTopLeft}>
            <span className={styles.quizTopicLabel}>{activeTopic.icon} {activeTopic.label}</span>
            <span className={styles.quizDiffChip}>{selectedDiff === "all" ? "Mixed" : selectedDiff}</span>
            {isReassessment && <span className={styles.reassessChip}>🔄 Reassessment</span>}
          </div>
          <div className={styles.quizTopRight}>
            {attemptsInfo && !isReassessment && (
              <span className={styles.attemptChip}>
                Attempt {attemptsInfo.used + 1}/{attemptsInfo.max}
              </span>
            )}
            <span className={styles.passMark}>Pass: {quiz.pass_mark}%</span>
          </div>
        </div>

        {/* Answer progress */}
        <div className={styles.quizProgressBar}>
          <div className={styles.quizProgressFill} style={{ width: `${(answered / total) * 100}%` }} />
        </div>
        <p className={styles.quizProgressLabel}>{answered}/{total} answered</p>

        {/* Questions */}
        {quiz.questions.map((q, idx) => {
          const isAnswered = q.type === "coding" ? !!codeByQid[q.id]?.trim() : !!answers[q.id];
          return (
            <div key={q.id} className={`${styles.qCard} ${isAnswered ? styles.qCardAnswered : ""}`}>
              <div className={styles.qCardHead}>
                <span className={styles.qNum}>Q{idx + 1}</span>
                <span className={`${styles.diffBadge} ${styles["diff_" + q.difficulty]}`}>{q.difficulty}</span>
                {q.type !== "mcq" && <span className={styles.typeBadge}>{TYPE_META[q.type]?.label || q.type}</span>}
              </div>

              {/* MCQ */}
              {q.type === "mcq" && (
                <>
                  <p className={styles.qPrompt}>{q.prompt}</p>
                  {q.options.map(o => (
                    <label key={o.id} className={`${styles.qOption} ${answers[q.id] === o.id ? styles.qOptionSel : ""}`}>
                      <input type="radio" name={q.id} value={o.id} checked={answers[q.id] === o.id}
                        onChange={() => pickAnswer(q.id, o.id)} disabled={quizSubmitting} />
                      <span>{o.text}</span>
                    </label>
                  ))}
                </>
              )}

              {/* Predict output */}
              {q.type === "predict_output" && (
                <>
                  <p className={styles.qPrompt}>What does this code output?</p>
                  <pre className={styles.codeBlock}>{q.code}</pre>
                  {q.options.map(o => (
                    <label key={o.id} className={`${styles.qOption} ${answers[q.id] === o.id ? styles.qOptionSel : ""}`}>
                      <input type="radio" name={q.id} value={o.id} checked={answers[q.id] === o.id}
                        onChange={() => pickAnswer(q.id, o.id)} disabled={quizSubmitting} />
                      <span className={styles.monoText}>{o.text}</span>
                    </label>
                  ))}
                </>
              )}

              {/* Debugging */}
              {q.type === "debugging" && (
                <>
                  <p className={styles.qPrompt}>What is wrong with this code?</p>
                  <pre className={styles.codeBlock}>{q.code}</pre>
                  {q.options.map(o => (
                    <label key={o.id} className={`${styles.qOption} ${answers[q.id] === o.id ? styles.qOptionSel : ""}`}>
                      <input type="radio" name={q.id} value={o.id} checked={answers[q.id] === o.id}
                        onChange={() => pickAnswer(q.id, o.id)} disabled={quizSubmitting} />
                      <span>{o.text}</span>
                    </label>
                  ))}
                </>
              )}

              {/* Coding */}
              {q.type === "coding" && (
                <>
                  <p className={styles.qPrompt}>{q.problem_statement}</p>
                  <div className={styles.codeMeta}>
                    <div><b>Input:</b> {q.input_format}</div>
                    <div><b>Output:</b> {q.output_format}</div>
                    <div><b>Constraints:</b> {q.constraints}</div>
                  </div>
                  {q.sample_test_cases?.length > 0 && (
                    <>
                      <p className={styles.sampleLabel}>Sample Test Cases</p>
                      {q.sample_test_cases.map((tc, i) => (
                        <div key={i} className={styles.testCase}>
                          <div><b>In {i+1}:</b> <code>{tc.input}</code></div>
                          <div><b>Out {i+1}:</b> <code>{tc.output}</code></div>
                        </div>
                      ))}
                    </>
                  )}
                  <div className={styles.langRow}>
                    <label className={styles.langLabel}>Language:</label>
                    <select className={styles.langSelect} value={codeLang} onChange={e => setCodeLang(e.target.value)}>
                      {q.languages?.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <textarea
                    className={styles.codeEditor}
                    placeholder={`Write your ${codeLang} solution here…`}
                    value={codeByQid[q.id] || ""}
                    onChange={e => editCode(q.id, e.target.value)}
                    disabled={quizSubmitting}
                    rows={10}
                    spellCheck={false}
                  />
                  <button className={styles.runBtn} onClick={() => handleRunCode(q.id)} disabled={running === q.id || quizSubmitting}>
                    {running === q.id ? "Running…" : "▶ Run sample tests"}
                  </button>
                  {runResults[q.id] && (
                    <div className={`${styles.runResult} ${runResults[q.id].configured ? styles.runResultOk : styles.runResultWarn}`}>
                      {!runResults[q.id].configured
                        ? <p>⚠ {runResults[q.id].message}</p>
                        : <p>Sample tests passed: {runResults[q.id].passed}/{runResults[q.id].total}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {quizError && <p className={styles.error}>{quizError}</p>}

        <div className={styles.quizActions}>
          <button className={styles.btnSecondary} onClick={goToSetup}>← Back</button>
          <button className={styles.btnPrimary} onClick={handleSubmit} disabled={quizSubmitting}>
            {quizSubmitting ? "Submitting…" : `Submit Quiz (${answered}/${total})`}
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: result
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "result") {
    const missed  = (result.results || []).filter(r => !r.correct);
    const correct = (result.results || []).filter(r => r.correct);
    const topicRes = result.topic_breakdown?.find(t => t.topic === activeTopic.id);
    const exhausted = !result.passed && result.attempts_remaining === 0;
    const isReassessment = result.mode === "reassessment";

    return (
      <div>
        {/* Score banner */}
        <div className={`${styles.scoreBanner} ${result.passed ? styles.scoreBannerPass : styles.scoreBannerFail}`}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreNum}>{result.score}%</span>
            <span className={styles.scoreVerdict}>{result.passed ? "PASSED ✓" : "FAILED ✗"}</span>
          </div>
          <div className={styles.scoreMeta}>
            <p className={styles.scoreDetail}>{correct.length}/{result.total_questions} correct · Pass: {result.pass_mark}%</p>
            <p className={styles.scoreTopic}>{activeTopic.icon} {activeTopic.label} · {selectedDiff === "all" ? "Mixed" : selectedDiff}</p>
            {isReassessment && <p className={styles.scoreMode}>🔄 Reassessment</p>}
            {!isReassessment && attemptsInfo && (
              <p className={styles.scoreAttempts}>
                Attempt {attemptsInfo.used}/{attemptsInfo.max} · {attemptsInfo.remaining} remaining
              </p>
            )}
          </div>
        </div>

        {/* If all attempts used and failed → enter recovery */}
        {exhausted && !isReassessment && (
          <div className={styles.recoveryNudge}>
            <p className={styles.recoveryNudgeTitle}>All 3 attempts used</p>
            <p className={styles.recoveryNudgeText}>Review your weak concepts, complete targeted practice, then unlock your reassessment.</p>
            <button className={styles.btnPrimary} onClick={() => { setView("recovery"); }}>
              Enter Recovery Mode →
            </button>
          </div>
        )}

        {/* Updated mastery */}
        {topicRes && (
          <div className={styles.resultSection}>
            <p className={styles.resultSectionTitle}>Updated Mastery</p>
            <div className={styles.masteryRow}>
              <div style={{ flex: 1 }}>
                <MasteryBar topic={topicRes.topic} score={topicRes.mastery_score} attempts={topicRes.attempts} />
              </div>
              <span className={`${styles.levelBadge} ${levelCls(topicRes.level)}`}>{topicRes.level}</span>
            </div>
            <div className={styles.masteryStats}>
              <span>Best <b>{topicRes.best_score}%</b></span>
              <span>Status <b style={{ textTransform: "capitalize" }}>{topicRes.status?.replace("_", " ")}</b></span>
            </div>
          </div>
        )}

        {/* Difficulty breakdown */}
        {result.difficulty_breakdown?.length > 0 && (
          <div className={styles.resultSection}>
            <p className={styles.resultSectionTitle}>Difficulty Breakdown</p>
            {result.difficulty_breakdown.map(d => (
              <div key={d.difficulty} className={styles.breakRow}>
                <span className={`${styles.diffBadge} ${styles["diff_" + d.difficulty]}`}>{d.difficulty}</span>
                <span className={styles.breakFrac}>{d.correct}/{d.total}</span>
                <div className={styles.barTrack} style={{ flex: 1 }}>
                  <div className={styles.barFillBlue} style={{ width: `${d.percent}%` }} />
                </div>
                <span className={styles.breakPct}>{d.percent}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Question review */}
        <div className={styles.resultSection}>
          <p className={styles.resultSectionTitle}>Question Review</p>
          {result.results.map((r, i) => (
            <div key={r.question_id} className={`${styles.reviewCard} ${r.correct ? styles.reviewOk : styles.reviewBad}`}>
              <div className={styles.reviewHead}>
                <span className={styles.reviewNum}>Q{i + 1}</span>
                <span className={`${styles.diffBadge} ${styles["diff_" + r.difficulty]}`}>{r.difficulty}</span>
                {r.type !== "mcq" && <span className={styles.typeBadge}>{TYPE_META[r.type]?.label || r.type}</span>}
                <span className={styles.reviewVerdict}>{r.correct ? "✓ Correct" : "✗ Wrong"}</span>
              </div>
              {r.code && <pre className={styles.codeBlock}>{r.code}</pre>}
              <p className={styles.reviewPrompt}>{r.prompt}</p>
              {!r.correct && r.type !== "coding" && (
                <>
                  <div className={styles.reviewAnswers}>
                    <span className={styles.wrongAns}>Your answer: {r.selected_text || "—"}</span>
                    <span className={styles.rightAns}>Correct: {r.correct_text}</span>
                  </div>
                  {r.explanation && <p className={styles.explanation}>💡 {r.explanation}</p>}
                </>
              )}
              {r.type === "coding" && !r.run_configured && (
                <p className={styles.muted}>⚠ Code execution sandbox not configured.</p>
              )}
            </div>
          ))}
        </div>

        {/* AI explanations */}
        {missed.filter(m => m.type !== "coding").length > 0 && (
          <div className={styles.resultSection}>
            <p className={styles.resultSectionTitle}>💬 AI Buddy Explanations</p>
            {explLoading
              ? <p className={styles.muted}>AI Buddy is analysing your mistakes…</p>
              : explanations
              ? <div className={styles.aiBox}>{explanations}</div>
              : null}
          </div>
        )}

        {/* Actions */}
        <div className={styles.resultActions}>
          {!exhausted && (
            <button className={styles.btnSecondary} onClick={goToSetup}>
              {result.passed ? "Revise Topic" : "Retry Quiz"}
            </button>
          )}
          <button className={styles.btnPrimary} onClick={goToTopics}>
            Back to {activePath.label}
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: recovery
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "recovery") {
    return (
      <RecoveryPanel
        token={token}
        topic={activeTopic.id}
        topicLabel={activeTopic.label}
        topicIcon={activeTopic.icon}
        qtype={selectedType || "mcq"}
        difficulty={selectedDiff}
        attemptHistory={attemptHistory}
        lastResults={result?.results || []}
        recovery={recoveryData || attemptsInfo?.recovery || {}}
        reassessmentRemaining={attemptsInfo?.reassessmentRemaining ?? 1}
        passThreshold={passThreshold}
        onStartPractice={null}
        onStartReassessment={startReassessment}
        onBack={goToSetup}
      />
    );
  }

  return null;
}
