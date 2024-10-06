import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User, { IUser } from '@/model/User'; // Use IUser interface for better type safety
import mongoose from 'mongoose';

// Ensure MongoDB connection is established
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID format' });
  }

  try {
    // Fetch the user from the database by ID
    const user = await User.findById(id) as IUser;

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return user data excluding sensitive fields
    return res.status(200).json({
      success: true,
      data: {
        id: user._id, // Ensure the ID is serialized properly
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null, // Default null if not available
        isVerified: user.isVerified,
        createdAt: user.createdAt, // ISO string for date is fine in most cases
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching user:', error);

    // Return a server error response
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
