import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB'; // Ensure correct path to DB connection utility
import User from '@/model/User'; // Ensure correct path to your User model

// Connect to the database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all users from MongoDB and exclude sensitive fields like password
      const users = await User.find().select('-password');

      // If no users are found, send a 404 response
      if (!users.length) {
        return res.status(404).json({ success: false, message: 'No users found' });
      }

      // Return the users with a success response
      return res.status(200).json({ success: true, users });
    } catch (error) {
      // Ensure the error is properly handled
      if (error instanceof Error) {
        console.error('Error fetching users:', error.message);
        return res.status(500).json({ success: false, message: error.message });
      } else {
        console.error('Unknown error occurred:', error);
        return res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
