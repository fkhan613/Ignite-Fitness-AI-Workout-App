import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  heightCm?: number;
  weightKg?: number;
  sex?: 'male' | 'female' | 'other';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  equipmentOwned: string[];
  goals: ('strength'|'hypertrophy'|'endurance'|'fat_loss')[];
  injuries: { area: string, note?: string }[];
  preferences: {
    daysPerWeek?: number;
    sessionMinutes?: number;
    dislikedExercises?: string[];
    homeVsGym?: 'home'|'gym';
  };
}

const UserSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  name: String,
  heightCm: Number,
  weightKg: Number,
  sex: { type: String, enum: ['male','female','other'] },
  experienceLevel: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  equipmentOwned: { type: [String], default: [] },
  goals: { type: [String], default: [] },
  injuries: { type: [{ area: String, note: String }], default: [] },
  preferences: {
    daysPerWeek: Number,
    sessionMinutes: Number,
    dislikedExercises: { type: [String], default: [] },
    homeVsGym: { type: String, enum: ['home','gym'] }
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
