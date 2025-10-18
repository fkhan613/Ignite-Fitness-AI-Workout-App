import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';
import Session from '../models/Session.js';

const router = Router();

router.post('/', requireAuth, async (req: AuthedRequest, res) => {
  const body = req.body;
  const session = await Session.create({ ...body, userId: req.userId });
  res.json(session);
});

router.patch('/:id', requireAuth, async (req: AuthedRequest, res) => {
  const s = await Session.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { $set: req.body }, { new: true });
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

router.get('/', requireAuth, async (req: AuthedRequest, res) => {
  const items = await Session.find({ userId: req.userId }).sort({ date: -1 }).limit(50);
  res.json(items);
});

export default router;
