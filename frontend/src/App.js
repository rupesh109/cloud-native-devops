import React, { useEffect, useState } from "react";
import "./App.css";

function Pill({ ok, text }) {
  return (
    <span className={`pill ${ok ? "pill-ok" : "pill-bad"}`}>
      {text}
    </span>
  );
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Nginx proxies /api -> backend
  const api = (path) => `/api${path}`;

  async function fetchAll() {
    setErr("");
    // health
    try {
      const h = await fetch(api("/health")).then((r) => r.json());
      setHealth(h?.ok ? "healthy" : "unhealthy");
    } catch {
      setHealth("unreachable");
    }
    // users
    try {
      const data = await fetch(api("/users")).then((r) => r.json());
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setErr("Couldn’t load users. Check backend and MongoDB.");
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function addUser() {
    if (!name.trim()) return;
    setLoading(true);
    setErr("");
    try {
      await fetch(api("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      setName("");
      await fetchAll();
    } catch {
      setErr("Add failed. Is backend up and MONGO_URI valid?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="title">
          <span className="emoji">🚀</span> DevOps Project
        </div>
        <div className="header-right">
          <Pill ok={health === "healthy"} text={`API: ${health ?? "…"}`} />
          <button className="btn ghost" onClick={fetchAll}>Refresh</button>
        </div>
      </header>

      <section className="card">
        <h3 className="card-title">Add User</h3>
        <div className="row">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ada Lovelace"
          />
          <button className="btn primary" onClick={addUser} disabled={loading}>
            {loading ? "Adding…" : "Add"}
          </button>
        </div>
        {err && <p className="error">{err}</p>}
      </section>

      <section className="card">
        <h3 className="card-title">Users</h3>
        {users.length === 0 ? (
          <p className="muted">No users yet — add one above.</p>
        ) : (
          <ul className="list">
            {users.map((u, i) => (
              <li key={i} className="list-item">
                <span className="avatar">{u.name?.[0]?.toUpperCase() || "?"}</span>
                <span className="name">{u.name}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="footnote">
          Deployed on <b>GCP Cloud Run</b> via <b>GitHub Actions</b> (WIF). Images from <b>Artifact Registry</b>.
        </p>
      </section>
    </div>
  );
}
