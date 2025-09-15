// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// --- Mongo (don't crash app if it can't connect on startup) ---
const MONGO_URI = process.env.MONGO_URI;
(async () => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI missing');
    await mongoose.connect(MONGO_URI, { dbName: 'app' });
    console.log('Mongo connected');
  } catch (e) {
    console.error('Mongo connect failed:', e.message);
  }
})();

// --- Health endpoint for Cloud Run ---
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- Your API ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ name: String }));
app.get('/users', async (_req, res) => {
  try { res.json(await User.find().lean()); } catch { res.json([]); }
});
app.post('/users', async (req, res) => {
  try { const u = await User.create({ name: req.body.name }); res.status(201).json(u); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// --- LISTEN on Cloud Run’s PORT ---
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log(`API listening on ${port}`));
