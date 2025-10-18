import mongoose, { Schema } from 'mongoose';
const ExerciseSchema = new Schema({
    name: { type: String, required: true },
    primaryMuscle: String,
    secondaryMuscles: [String],
    equipment: [String],
    movementPattern: String,
    difficulty: Number,
    isUnilateral: Boolean,
    contraindications: [String],
    tags: [String],
    videoUrl: String,
    instructions: [String]
}, { timestamps: true });
ExerciseSchema.index({ name: 'text', tags: 'text', primaryMuscle: 'text' });
export default mongoose.model('Exercise', ExerciseSchema);
