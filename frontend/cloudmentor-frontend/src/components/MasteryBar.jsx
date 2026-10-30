import styles from "./MasteryBar.module.css";

function barColor(score) {
  if (score >= 80) return styles.advanced;
  if (score >= 50) return styles.intermediate;
  return styles.beginner;
}

export default function MasteryBar({ topic, score, attempts }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>
        <span className={styles.topicName}>{topic}</span>
        <span className={styles.meta}>{score}/100 · {attempts} attempt{attempts !== 1 ? "s" : ""}</span>
      </div>
      <div className={styles.track}>
        <span className={barColor(score)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
