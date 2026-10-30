import { useState, useEffect } from "react";
import { fetchMastery, fetchRecommendation, fetchWeeklyReport } from "../api.js";
import MasteryBar from "../components/MasteryBar.jsx";
import styles from "./ProgressPanel.module.css";

function levelClass(level) {
  if (level === "Advanced")     return styles.levelAdvanced;
  if (level === "Intermediate") return styles.levelIntermediate;
  return styles.levelBeginner;
}

export default function ProgressPanel({ token }) {
  const [mastery, setMastery] = useState([]);
  const [rec, setRec]         = useState(null);
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [m, r, rep] = await Promise.all([
        fetchMastery(token),
        fetchRecommendation(token),
        fetchWeeklyReport(token),
      ]);
      setMastery(m);
      setRec(r);
      setReport(rep);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <p className={styles.muted}>Loading progress...</p>;
  if (error)   return <p className={styles.error}>{error}</p>;

  return (
    <div>
      {/* AI recommendation */}
      {rec && (
        <div className={styles.recCard}>
          <p className={styles.recLabel}>Next recommended topic</p>
          <p className={styles.recTopic}>{rec.topic}</p>
          <p className={styles.recReason}>{rec.reason}</p>
        </div>
      )}

      {/* Per-topic mastery */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Topic Mastery</p>
        {mastery.length === 0 ? (
          <p className={styles.muted}>No quiz attempts yet — pick a topic and take a quiz.</p>
        ) : (
          mastery.map((t) => (
            <div key={t.topic} className={styles.masteryRow}>
              <div className={styles.masteryBarWrap}>
                <MasteryBar topic={t.topic} score={t.mastery_score} attempts={t.attempts} />
              </div>
              <div className={styles.masteryMeta}>
                <span className={`${styles.levelBadge} ${levelClass(t.level)}`}>{t.level}</span>
                <span className={styles.passCount}>
                  ✓ {t.passed_attempts} &nbsp; ✗ {t.failed_attempts}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Weekly report */}
      {report && (
        <div className={styles.reportCard}>
          <p className={styles.reportText}>{report.summary_text}</p>
          <p className={styles.reportPlan}>{report.next_week_plan}</p>
        </div>
      )}

      <button className={styles.refreshBtn} onClick={load}>Refresh</button>
    </div>
  );
}
