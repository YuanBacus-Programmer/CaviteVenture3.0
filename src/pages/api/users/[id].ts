import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB'; // Ensure the correct path to your DB connection utility
import User from '@/model/User'; // Ensure the correct path to your User model

// Connect to the database
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Get the user ID from the query parameters

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  if (req.method === 'PUT') {
    const { role } = req.body;

    // Validate the role
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
      // Find the user by ID and update the role
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role: role.toLowerCase() }, // Ensure the role is saved in lowercase
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Respond with the updated user
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      // Log and handle server error
      console.error('Error updating user role:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // If the method is not PUT, return a 405 Method Not Allowed
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
