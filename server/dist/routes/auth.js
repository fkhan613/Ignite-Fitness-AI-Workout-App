import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { JWT_SECRET } from '../config.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
});
router.post('/register', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password, name } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, equipmentOwned: [], goals: ['hypertrophy'] });
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});
router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
});
router.get('/me', requireAuth, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user)
        return res.status(404).json({ error: 'Not found' });
    return res.json(user);
});
router.put('/me', requireAuth, async (req, res) => {
    const body = req.body;
    const user = await User.findByIdAndUpdate(req.userId, body, { new: true });
    return res.json(user);
});
export default router;
