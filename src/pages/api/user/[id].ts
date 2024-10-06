import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User, { IUser } from '@/model/User'; // Use the IUser interface and model
import mongoose from 'mongoose';

// Ensure MongoDB connection is established once
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID format' });
  }

  try {
    // Find the user by ID in MongoDB
    const user = await User.findById(id) as IUser;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return user data excluding sensitive fields (e.g., password)
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        createdAt: user.createdAt, // Now available
        updatedAt: user.updatedAt, // Now available
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
