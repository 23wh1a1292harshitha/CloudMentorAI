import { useState } from "react";
import LearningPathsPanel from "./LearningPathsPanel.jsx";
import ProgressPanel from "./ProgressPanel.jsx";
import ChatPanel from "./ChatPanel.jsx";
import styles from "./Dashboard.module.css";

const TABS = [
  { id: "paths",    label: "📚 Learning Paths" },
  { id: "progress", label: "📊 Progress" },
  { id: "chat",     label: "💬 AI Buddy" },
];

export default function Dashboard({ token, user }) {
  const [activeTab, setActiveTab] = useState("paths");

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.navBtn} ${activeTab === t.id ? styles.active : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className={styles.panel}>
        {activeTab === "paths"    && <LearningPathsPanel token={token} />}
        {activeTab === "progress" && <ProgressPanel      token={token} />}
        {activeTab === "chat"     && <ChatPanel          token={token} />}
      </div>
    </div>
  );
}
