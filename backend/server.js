const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// --- Health for Cloud Run ---
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// --- Mongo (don’t crash app if down) ---
const MONGO_URI = process.env.MONGO_URI;
(async () => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI missing');
    await mongoose.connect(MONGO_URI, { dbName: 'app' });
    console.log('✅ Mongo connected');
  } catch (e) {
    console.error('❌ Mongo connection error:', e.message);
  }
})();

// --- Simple Users API ---
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ name: String }));

app.get('/api/users', async (_req, res) => {
  try { res.json(await User.find().lean()); }
  catch { res.json([]); }
});

app.post('/api/users', async (req, res) => {
  try { const u = await User.create({ name: req.body.name }); res.status(201).json(u); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// --- Listen on PORT for Cloud Run ---
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log(`API listening on ${port}`));

