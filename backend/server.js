const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB Connection (env for Cloud Run; local default for docker-compose)
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/devopsdb";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Mongo connected"))
  .catch((err) => console.error("❌ Mongo connection error:", err.message));

// Health checks (both paths so it works directly and via /api proxy)
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Routes (unchanged; Nginx /api proxy will strip the /api prefix)
const UserSchema = new mongoose.Schema({ name: String });
const User = mongoose.model("User", UserSchema);

app.get("/", (_req, res) => res.send("Backend API running 🚀"));

app.post("/users", async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.send(user);
});

app.get("/users", async (_req, res) => {
  const users = await User.find();
  res.send(users);
});

// Cloud Run listens on $PORT (defaults to 8080)
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => console.log(`Backend running on port ${port}`));
