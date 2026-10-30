import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api.js";
import styles from "./ChatPanel.module.css";

export default function ChatPanel({ token }) {
  const [messages, setMessages] = useState([
    { id: 0, role: "ai", text: "Hi! I'm AI Buddy. Ask me anything about coding or your learning progress." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", text };
    const thinkingMsg = { id: Date.now() + 1, role: "ai", text: "Thinking...", thinking: true };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setLoading(true);

    try {
      const data = await sendChatMessage(token, text);
      setMessages((prev) =>
        prev
          .filter((m) => !m.thinking)
          .concat({
            id: Date.now() + 2,
            role: "ai",
            text: data.reply,
            escalate: data.escalate_to_mentor,
            suggestedTopic: data.suggested_topic,
          })
      );
    } catch (err) {
      setMessages((prev) =>
        prev.filter((m) => !m.thinking).concat({ id: Date.now() + 2, role: "error", text: err.message })
      );
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {messages.map((m) => (
          <div key={m.id} className={`${styles.msg} ${styles[m.role]} ${m.thinking ? styles.thinking : ""}`}>
            <p>{m.text}</p>
            {m.escalate && (
              <div className={styles.escalate}>
                🟠 A mentor session might help for <strong>{m.suggestedTopic}</strong>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Ask AI Buddy anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={loading}
        />
        <button className={styles.sendBtn} onClick={send} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
