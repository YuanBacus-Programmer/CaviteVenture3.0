// /models/Feedback.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface FeedbackDocument extends Document {
  avatar: string;
  firstName: string;
  rating: number;
  thoughts: string;
  suggestions: string;
}

const FeedbackSchema = new Schema<FeedbackDocument>({
  avatar: { type: String, required: true },
  firstName: { type: String, required: true },
  rating: { type: Number, required: true },
  thoughts: { type: String, required: true },
  suggestions: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Feedback || mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema);
