// backend/server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

const User = mongoose.model(
  "User",
  new mongoose.Schema({ name: String }, { collection: "users" })
);

async function start() {
  // Connect first; if this fails we exit so Cloud Run restarts with clear logs
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("✅ Mongo connected");

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.get("/api/users", async (_req, res) => {
    const users = await User.find().lean();
    res.json(users);
  });
  app.post("/api/users", async (req, res) => {
    if (!req.body?.name?.trim()) return res.status(400).json({ error: "name required" });
    const doc = await User.create({ name: req.body.name.trim() });
    res.json(doc);
  });

  // Optional: make "/" show something friendly instead of "Cannot GET /"
  app.get("/", (_req, res) => res.send("Backend OK"));

  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
}

start().catch((err) => {
  console.error("❌ Fatal DB connect error:", err?.message || err);
  process.exit(1); // let Cloud Run restart; logs will show the real reason
});

