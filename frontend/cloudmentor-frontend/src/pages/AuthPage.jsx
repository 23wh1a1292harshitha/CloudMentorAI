import { useState } from "react";
import { login, signup } from "../api.js";
import styles from "./AuthPage.module.css";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("student@test.com");
  const [password, setPassword] = useState("pass123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "signup"
          ? await signup({ name: name || "Student", email, password })
          : await login({ email, password });
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message + (mode === "login" ? " — try Sign up if this is your first visit." : ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >Log in</button>
          <button
            className={`${styles.tab} ${mode === "signup" ? styles.active : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}
          >Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
