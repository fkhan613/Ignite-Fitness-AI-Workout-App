🏋️‍♂️ Ignite Fitness — AI-Powered Workout Companion

Ignite Fitness is a modern, AI-driven workout application that builds personalized training plans based on your energy level, available time, and equipment.
It combines intelligent recommendations, sleek design, and interactive progress tracking to help you train smarter and stay consistent.

⚙️ Tech Stack

Frontend: React + TypeScript + Vite + Tailwind CSS + Framer Motion + Recharts
Backend: Node.js + Express + MongoDB + TypeScript
AI Service: Python + FastAPI (exercise suitability scoring)

🚀 Features

🤖 AI-Based Workout Plans — Dynamically generated based on your goals, energy, and equipment

💪 Workout Logger — Log sets, reps, and track your performance over time

📈 Progress Visualization — Modern charts showing volume, PRs, and trends

⚡ Smooth UI/UX — Minimalistic red-white-black design with clean animations and transitions

🔐 JWT Authentication — Secure login and registration

🧠 Modular Architecture — Separate ML microservice for scalability and future model upgrades

A minimal but complete starter for a fitness app that recommends workouts based on user energy, available equipment, and recent history.  
Tech stack:
- **Frontend**: React + Vite + TypeScript + Tailwind + Recharts
- **Backend**: Node.js + Express + TypeScript + MongoDB (Mongoose) + JWT
- **ML Service**: Python + FastAPI (stub scoring with a simple heuristic but ready to swap with a trained model)

🧠 Future Enhancements

Integrate a trained ML model for smarter plan recommendations

Add wearable data sync (Apple Watch / Fitbit)

Social features (share workouts and progress)

Personalized nutrition and recovery tracking

## Monorepo Structure
```
smart-workout/
  client/         # React frontend
  server/         # Express API + MongoDB models + rule-based recommender
  ml/             # FastAPI microservice that scores exercise suitability
```
---

## 1) Prerequisites
- Node.js (>= 18)
- Python (>= 3.9)
- MongoDB (use local MongoDB or MongoDB Atlas)

## 2) Environment
Create `.env` files from the provided `.env.example` files.

**server/.env**
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/smartworkout
JWT_SECRET=supersecret_dev_key_change_me
CORS_ORIGIN=http://localhost:5173
ML_SERVICE_URL=http://127.0.0.1:8000
```

**ml/.env (optional)**
```
HOST=127.0.0.1
PORT=8000
```

## 3) Install & Seed
Open three terminals (one per app).

### A) Backend (server)
```
cd server
npm install
npm run seed     # seeds ~30 exercises
npm run dev
```
Server runs on http://localhost:4000

### B) ML Service (ml)
```
cd ml
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
ML service runs on http://127.0.0.1:8000

### C) Frontend (client)
```
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## 4) Login & Use
1. Register on the frontend (email/password).  
2. Add your **equipment** and **goals** on Profile (Dashboard).  
3. Go to **Recommend** → choose energy/time/equipment overrides → **Get Plan**.  
4. Start the session and log sets; see **Charts** for PR/Volume.

## 5) Notes
- The recommender is **rule-based** + calls the ML microservice for a **suitability score** (stub). Replace the ML heuristic with a trained model later.
- Code is cleanly split so you can evolve templates/overload logic and ML independently.
