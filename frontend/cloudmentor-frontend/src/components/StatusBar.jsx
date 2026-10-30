import { useEffect, useState, useCallback } from "react";
import { healthCheck } from "../api.js";
import styles from "./StatusBar.module.css";

export default function StatusBar() {
  const [buddy, setBuddy] = useState("wait");
  const [tests, setTests] = useState("wait");

  const check = useCallback(() => {
    setBuddy("wait"); setTests("wait");
    healthCheck().then(({ buddy: b, tests: t }) => {
      setBuddy(b ? "ok" : "bad");
      setTests(t ? "ok" : "bad");
    }).catch(() => { setBuddy("bad"); setTests("bad"); });
  }, []);

  useEffect(() => { check(); }, [check]);

  const label = { ok: "Connected", bad: "Offline", wait: "Checking…" };
  const anyBad = buddy === "bad" || tests === "bad";

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <span className={`${styles.dot} ${styles[buddy]}`} aria-label={`AI Buddy ${label[buddy]}`} />
        <span>AI Buddy — {label[buddy]}</span>
      </div>
      <div className={styles.row}>
        <span className={`${styles.dot} ${styles[tests]}`} aria-label={`Testing Engine ${label[tests]}`} />
        <span>Testing Engine — {label[tests]}</span>
      </div>
      {anyBad && (
        <button className={styles.retryBtn} onClick={check} aria-label="Retry service health check">
          ↻ Retry
        </button>
      )}
    </div>
  );
}
