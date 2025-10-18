import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartworkout';
export const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
