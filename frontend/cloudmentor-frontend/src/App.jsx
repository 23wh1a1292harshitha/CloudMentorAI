import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StatusBar from "./components/StatusBar.jsx";
import styles from "./App.module.css";

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem("cm_token"));
  const [user, setUser] = useState(() => {
    const u = sessionStorage.getItem("cm_user");
    return u ? JSON.parse(u) : null;
  });

  function handleLogin(token, user) {
    sessionStorage.setItem("cm_token", token);
    sessionStorage.setItem("cm_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  function handleLogout() {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>C</span>
          <span className={styles.brandName}>CloudMentor AI</span>
        </div>
        {user && (
          <div className={styles.userBar}>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
          </div>
        )}
      </header>

      <StatusBar />

      <main className={styles.main}>
        {!token ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <Dashboard token={token} user={user} />
        )}
      </main>
    </div>
  );
}
