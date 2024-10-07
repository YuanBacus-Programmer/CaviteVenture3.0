// /models/Feedback.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface FeedbackDocument extends Document {
  avatar: string;
  firstName: string;
  rating: number;
  comment: string;
  date: string;
}

const FeedbackSchema = new Schema<FeedbackDocument>({
  avatar: { type: String, required: true },
  firstName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Feedback || mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema);
