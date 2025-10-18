import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    name: String,
    heightCm: Number,
    weightKg: Number,
    sex: { type: String, enum: ['male', 'female', 'other'] },
    experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    equipmentOwned: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    injuries: { type: [{ area: String, note: String }], default: [] },
    preferences: {
        daysPerWeek: Number,
        sessionMinutes: Number,
        dislikedExercises: { type: [String], default: [] },
        homeVsGym: { type: String, enum: ['home', 'gym'] }
    }
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
