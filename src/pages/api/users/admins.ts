import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/model/User'; // Ensure this model is correctly imported

connectDB(); // Ensure MongoDB is connected

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const admins = await User.find({ role: 'admin' }); // Fetch only admin users
      res.status(200).json({ success: true, users: admins });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
