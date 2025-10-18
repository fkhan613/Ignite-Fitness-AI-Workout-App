import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISetLog {
  exerciseId: Types.ObjectId;
  setNo: number;
  reps: number;
  loadKg?: number;
  rpe?: number;
  durationSec?: number;
}

export interface ISession extends Document {
  userId: Types.ObjectId;
  date: Date;
  energy: number; // 1..5
  soreness: Record<string, number>;
  availableEquipment: string[];
  timeAvailableMin: number;
  plannedBlocks: {
    exerciseId: Types.ObjectId;
    targetSets: number;
    targetReps: string;
    targetLoadKg?: number;
    restSec?: number;
  }[];
  actualSets: ISetLog[];
  notes?: string;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  energy: Number,
  soreness: { type: Schema.Types.Mixed, default: {} },
  availableEquipment: [String],
  timeAvailableMin: Number,
  plannedBlocks: [{
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    targetSets: Number,
    targetReps: String,
    targetLoadKg: Number,
    restSec: Number
  }],
  actualSets: [{
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    setNo: Number,
    reps: Number,
    loadKg: Number,
    rpe: Number,
    durationSec: Number
  }],
  notes: String
}, { timestamps: true });

export default mongoose.model<ISession>('Session', SessionSchema);
