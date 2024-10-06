import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB'; // Ensure the correct DB connection utility
import User from '@/model/User'; // Ensure the correct path to the User model

// Ensure MongoDB is connected
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch only users with the 'admin' role from MongoDB
      const admins = await User.find({ role: 'admin' }).select('-password'); // Exclude sensitive fields like password

      // If no admins are found, return a 404 response
      if (!admins.length) {
        return res.status(404).json({ success: false, message: 'No admin users found' });
      }

      // Return the admin users with a success response
      return res.status(200).json({ success: true, users: admins });
    } catch (error) {
      // Handle the error and log it
      if (error instanceof Error) {
        console.error('Error fetching admin users:', error.message);
        return res.status(500).json({ success: false, message: error.message });
      } else {
        console.error('Unknown error fetching admin users:', error);
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
