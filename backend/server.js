// backend/src/server.js
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://mongo:27017/devops"; // local fallback for docker-compose

// --- reuse a single Mongo client across requests ---
let client;
async function getDb() {
  if (!client) {
    client = new MongoClient(MONGO_URI, { maxPoolSize: 5 });
    await client.connect();
  }
  return client.db(); // default DB from URI
}

// --- health endpoints (both /health and /api/health) ---
async function healthHandler(_req, res) {
  try {
    // ping DB (optional)
    try {
      const db = await getDb();
      await db.command({ ping: 1 });
      res.json({ ok: true, ts: new Date().toISOString(), db: "ok" });
    } catch {
      res.json({ ok: true, ts: new Date().toISOString(), db: "unreachable" });
    }
  } catch (e) {
    res.status(200).json({ ok: true, ts: new Date().toISOString() });
  }
}
app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// --- users endpoints (both /users and /api/users) ---
async function listUsers(_req, res) {
  try {
    const db = await getDb();
    const users = await db.collection("users").find({}).sort({ _id: -1 }).toArray();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
}

async function addUser(req, res) {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "name_required" });
    const db = await getDb();
    const doc = { name: name.trim(), createdAt: new Date() };
    await db.collection("users").insertOne(doc);
    res.status(201).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db_error" });
  }
}

// root form
app.get("/users", listUsers);
app.post("/users", addUser);
// prefixed form
app.get("/api/users", listUsers);
app.post("/api/users", addUser);

app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
