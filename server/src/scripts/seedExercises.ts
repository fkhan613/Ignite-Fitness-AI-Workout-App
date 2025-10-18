import mongoose from 'mongoose';
import { MONGO_URI } from '../config.js';
import Exercise from '../models/Exercise.js';
import data from '../data/exercises.json' assert { type: 'json' };

(async () => {
  await mongoose.connect(MONGO_URI);
  const count = await Exercise.countDocuments();
  if (count > 0) {
    console.log('Exercises already seeded:', count);
    process.exit(0);
  }
  await Exercise.insertMany(data);
  console.log('Seeded exercises:', data.length);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
