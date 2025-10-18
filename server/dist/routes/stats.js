import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Session from '../models/Session.js';
const router = Router();
router.get('/volume-weekly', requireAuth, async (req, res) => {
    const sessions = await Session.find({ userId: req.userId }).sort({ date: 1 });
    // naive volume calc: sum reps*load per muscle (approx by planned first exercise muscle unavailable, so just sum reps*load)
    const weekly = {};
    for (const s of sessions) {
        const week = new Date(s.date);
        const key = `${week.getUTCFullYear()}-W${Math.ceil((week.getUTCDate()) / 7)}`;
        let vol = 0;
        for (const set of s.actualSets || []) {
            const load = set.loadKg || 0;
            vol += (set.reps || 0) * load;
        }
        weekly[key] = (weekly[key] || 0) + vol;
    }
    res.json(weekly);
});
export default router;
