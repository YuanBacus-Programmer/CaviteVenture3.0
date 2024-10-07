// /pages/api/feedback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import Feedback from '@/model/FeedbackAS';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    if (req.method === 'POST') {
      const { avatar, firstName, rating, thoughts, suggestions } = req.body;

      if (!avatar || !firstName || !rating || !thoughts || !suggestions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const feedback = new Feedback({
        avatar,
        firstName,
        rating,
        thoughts,
        suggestions,
      });

      await feedback.save();
      res.status(201).json({ message: 'Feedback saved successfully', feedback });

    } else if (req.method === 'GET') {
      const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(10);
      res.status(200).json(feedbacks);

    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
