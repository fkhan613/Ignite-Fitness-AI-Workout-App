from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import numpy as np

app = FastAPI(title="smart-workout-ml")

class ExerciseIn(BaseModel):
    id: str
    primaryMuscle: str
    difficulty: int | None = None
    tags: List[str] = []
    equipment: List[str] = []

class ScoreReq(BaseModel):
    energy: int
    timeAvailableMin: int
    goals: List[str]
    exercises: List[ExerciseIn]

@app.get("/")
def root():
    return {"ok": True, "service": "ml"}

@app.post("/score")
def score(req: ScoreReq):
    # Very simple heuristic scoring (placeholder for a trained model)
    goal = req.goals[0] if req.goals else "hypertrophy"
    scores = []
    for ex in req.exercises:
        base = 0.0
        # Prefer compound for strength at high energy
        if goal == "strength" and req.energy >= 4 and (("compound" in ex.tags) or (ex.difficulty and ex.difficulty >=3)):
            base += 1.5
        # Prefer accessories at low energy / limited time
        if req.energy <= 2 and ("accessory" in ex.tags or ex.difficulty and ex.difficulty <=2):
            base += 1.0
        # Light penalty if machine-only with high energy (encourage free weights)
        if req.energy >= 4 and "machine" in ex.equipment:
            base -= 0.2
        # Light boost for diversity
        musc_factor = hash(ex.primaryMuscle) % 5 / 10.0
        base += musc_factor
        # Difficulty modestly scaled
        diff = ex.difficulty or 2
        base += min(diff, 5) * 0.1
        scores.append({"id": ex.id, "score": float(base)})
    # normalize
    if scores:
        vals = np.array([s["score"] for s in scores])
        m, sd = float(vals.mean()), float(vals.std() + 1e-6)
        for s in scores:
            s["score"] = (s["score"] - m) / sd
    return {"scores": scores}
