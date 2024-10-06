import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/model/User'; // Ensure the correct path to your User model

// Connect to the database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle only GET requests
  if (req.method === 'GET') {
    try {
      // Fetch all users from MongoDB
      const users = await User.find();

      // If no users are found, send a 404 response
      if (!users.length) {
        return res.status(404).json({ success: false, message: 'No users found' });
      }

      // Return the users with a success response
      res.status(200).json({ success: true, users });
    } catch (error) {
      // Type check the error and return a 500 error if something went wrong
      if (error instanceof Error) {
        // Handle known error instance
        res.status(500).json({ success: false, message: error.message });
      } else {
        // Handle unknown error (fallback)
        res.status(500).json({ success: false, message: 'An unknown error occurred' });
      }
    }
  } else {
    // Handle requests that are not GET with a 405 Method Not Allowed
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
