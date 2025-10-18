import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Exercise from '../models/Exercise.js';
import { chooseTemplate } from '../utils/templates.js';
import fetch from 'node-fetch';
import { ML_SERVICE_URL } from '../config.js';
const router = Router();
function avoidSore(soreness) {
    return (ex) => {
        const soreLevel = soreness[ex.primaryMuscle] || 0;
        return soreLevel <= 3; // avoid very sore muscles
    };
}
function hasEquipment(available) {
    return (ex) => ex.equipment.every((e) => e === 'bodyweight' || available.includes(e));
}
router.post('/', requireAuth, async (req, res) => {
    const { energy, timeAvailableMin, soreness = {}, equipmentOverride } = req.body;
    const user = await User.findById(req.userId);
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    const available = equipmentOverride?.length ? equipmentOverride : user.equipmentOwned;
    const all = await Exercise.find({});
    // filter
    const filtered = all.filter(avoidSore(soreness)).filter(hasEquipment(available));
    if (filtered.length === 0)
        return res.status(400).json({ error: 'No suitable exercises found. Add more equipment or lower soreness.' });
    // template
    const template = chooseTemplate({ energy, timeAvailableMin, goals: user.goals });
    const blocks = template.blocks;
    // rank (query ML service for suitability, fallback to simple rank by difficulty and tags)
    let ranked = filtered;
    try {
        const resp = await fetch(`${ML_SERVICE_URL}/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                energy,
                timeAvailableMin,
                goals: user.goals,
                exercises: filtered.map(ex => ({
                    id: ex._id.toString(),
                    primaryMuscle: ex.primaryMuscle,
                    difficulty: ex.difficulty,
                    tags: ex.tags,
                    equipment: ex.equipment
                }))
            })
        });
        const data = await resp.json();
        if (Array.isArray(data?.scores)) {
            const scoreMap = new Map(data.scores.map((s) => [s.id, s.score]));
            ranked = filtered.sort((a, b) => (scoreMap.get(b._id.toString()) || 0) - (scoreMap.get(a._id.toString()) || 0));
        }
    }
    catch (e) {
        console.log('ML service unavailable, using heuristic rank');
        ranked = filtered.sort((a, b) => (b.difficulty || 1) - (a.difficulty || 1));
    }
    const plan = [];
    const restSec = template.restSec;
    const repScheme = template.repScheme;
    let i = 0;
    const usedMuscles = new Set();
    while (plan.length < blocks && i < ranked.length) {
        const ex = ranked[i++];
        // diversify muscles & movement patterns
        if (usedMuscles.has(ex.primaryMuscle) && Math.random() < 0.5)
            continue;
        usedMuscles.add(ex.primaryMuscle);
        plan.push({
            exerciseId: ex._id,
            name: ex.name,
            sets: template.targetSets[plan.length],
            reps: repScheme[Math.min(plan.length, repScheme.length - 1)],
            restSec
        });
    }
    res.json({
        plan,
        rationale: `Energy=${energy}, time=${timeAvailableMin}min, goals=${user.goals.join(', ')}, template=${template.type}`
    });
});
export default router;
