import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string[];
  movementPattern: string;
  difficulty: number;
  isUnilateral: boolean;
  contraindications: string[];
  tags: string[];
  videoUrl?: string;
  instructions: string[];
}

const ExerciseSchema = new Schema<IExercise>({
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

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
