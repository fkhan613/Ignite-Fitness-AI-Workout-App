import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { CORS_ORIGIN, MONGO_URI, PORT } from './config.js';
import authRouter from './routes/auth.js';
import exercisesRouter from './routes/exercises.js';
import recommendationsRouter from './routes/recommendations.js';
import sessionsRouter from './routes/sessions.js';
import statsRouter from './routes/stats.js';

// Add this helper after imports
function mask(uri: string) {
  try {
    const u = new URL(uri);
    if (u.password) u.password = '***';
    return `${u.protocol}//${u.username ? u.username + ':***@' : ''}${u.host}${u.pathname}${u.search}`;
  } catch {
    return '[unparsable MONGO_URI]';
  }
}

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.get('/', (_req, res) => res.json({ ok: true, service: 'smart-workout-server' }));
app.use('/auth', authRouter);
app.use('/exercises', exercisesRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/sessions', sessionsRouter);
app.use('/stats', statsRouter);

async function start() {
  console.log('Connecting to MongoDB:', mask(MONGO_URI));
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 20000,
  });
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}
start().catch((e) => { console.error(e); process.exit(1); });