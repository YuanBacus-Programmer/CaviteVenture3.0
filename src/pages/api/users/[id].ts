import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB'; // Ensure this path is correct for your DB connection utility
import User from '@/model/User'; // Ensure this path is correct for your User model

// Ensure MongoDB is connected
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Extract the ID from the query parameters

  // Ensure the request method is PUT for updating a user's role
  if (req.method === 'PUT') {
    const { role } = req.body; // Get the new role from the request body

    // Validate the provided role
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
      // Find the user by ID and update the role
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role: role.toLowerCase() }, // Ensure the role is saved in lowercase
        { new: true } // Return the updated user
      );

      // If the user is not found, return a 404 error
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Return the updated user as a success response
      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      // Log and handle any server errors
      console.error('Error updating user role:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // If the request method is not PUT, return a 405 error (Method Not Allowed)
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
