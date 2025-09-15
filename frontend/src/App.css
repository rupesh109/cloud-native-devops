// frontend/src/App.js
import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

const api = (path) => `/api${path}`; // Nginx proxies /api → Cloud Run backend

function Pill({ ok, children }) {
  return (
    <span className={`pill ${ok ? "pill-ok" : "pill-bad"}`}>
      {children}
    </span>
  );
}

export default function App() {
  const [health, setHealth] = useState(null); // "healthy" | "unhealthy" | "unreachable" | null
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // bundle health + users fetch; useCallback so eslint is happy in CI
  const fetchAll = useCallback(async () => {
    setErr("");
    try {
      const h = await fetch(api("/health")).then((r) => r.json());
      setHealth(h?.ok ? "healthy" : "unhealthy");
    } catch {
      setHealth("unreachable");
    }

    try {
      const data = await fetch(api("/users")).then((r) => r.json());
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setErr("Couldn’t load users. Check backend and MongoDB.");
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addUser = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setErr("");
    try {
      await fetch(api("/users"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setName("");
      await fetchAll();
    } catch {
      setErr("Add failed. Is backend up and MONGO_URI valid?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="title">
          <span className="emoji">🚀</span> DevOps Project
        </div>
        <div className="header-right">
          {health && (
            <Pill ok={health === "healthy"}>
              API: {health}
            </Pill>
          )}
          <button className="btn ghost" onClick={fetchAll}>Refresh</button>
        </div>
      </header>

      {/* Add user card */}
      <section className="card">
        <h3 className="card-title">Add User</h3>
        <div className="row">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ada Lovelace"
          />
          <button
            className="btn primary"
            onClick={addUser}
            disabled={loading}
          >
            {loading ? "Adding…" : "Add"}
          </button>
        </div>
        {err && <p className="error">{err}</p>}
      </section>

      {/* Users list */}
      <section className="card">
        <h3 className="card-title">Users</h3>
        {users.length === 0 ? (
          <p className="muted">No users yet — add one above.</p>
        ) : (
          <ul className="list">
            {users.map((u, i) => (
              <li className="list-item" key={u._id || i}>
                <span className="avatar">{(u.name || "?").slice(0, 1).toUpperCase()}</span>
                <span className="name">{u.name}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="footnote">
          Deployed on <b>GCP Cloud Run</b> via <b>GitHub Actions</b> (WIF) • Images from <b>Artifact Registry</b>
        </p>
      </section>
    </div>
  );
}
