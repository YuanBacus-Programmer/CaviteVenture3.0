import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/model/User'; // Ensure the correct path to your User model

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Check for the provided ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  if (req.method === 'PUT') {
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role: role.toLowerCase() }, // Ensure role is saved in lowercase
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error); // Log the error to the console
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
      console.error('Error deleting user:', error); // Log the error to the console
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
