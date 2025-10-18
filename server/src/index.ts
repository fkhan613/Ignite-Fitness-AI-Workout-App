import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { CORS_ORIGIN, MONGO_URI, PORT } from './config.js';
import authRouter from './routes/auth.js';
import exercisesRouter from './routes/exercises.js';
import recommendationsRouter from './routes/recommendations.js';
import sessionsRouter from './routes/sessions.js';
import statsRouter from './routes/stats.js';

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
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}
start().catch((e) => { console.error(e); process.exit(1); });
