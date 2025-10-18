import mongoose, { Schema } from 'mongoose';
const SessionSchema = new Schema({
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
export default mongoose.model('Session', SessionSchema);
