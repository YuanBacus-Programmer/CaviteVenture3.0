// /pages/api/user/[userId].ts

import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/model/User'; // Ensure the correct path to your User model

// Ensure database is connected
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  // Handle GET request
  if (req.method === 'GET') {
    try {
      // Fetch user by ID from MongoDB
      const user = await User.findById(userId);

      // If no user found, return 404
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Return the user data
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      // Log and handle any server errors
      console.error('Error fetching user:', error);
      return res.status(500).json({ success: false, message: 'Server error occurred' });
    }
  } else {
    // Handle non-GET requests
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
