import { Router } from 'express';
import Exercise from '../models/Exercise.js';
const router = Router();
router.get('/', async (req, res) => {
    const { muscle, equipment, q } = req.query;
    const filter = {};
    if (muscle)
        filter.$or = [{ primaryMuscle: muscle }, { secondaryMuscles: muscle }];
    if (equipment)
        filter.equipment = { $in: equipment.split(',') };
    if (q)
        filter.$text = { $search: q };
    const items = await Exercise.find(filter).limit(200);
    res.json(items);
});
router.get('/:id', async (req, res) => {
    const ex = await Exercise.findById(req.params.id);
    if (!ex)
        return res.status(404).json({ error: 'Not found' });
    res.json(ex);
});
export default router;
