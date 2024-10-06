import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User, { IUser } from '@/model/User';
import mongoose from 'mongoose';

// Ensure MongoDB connection is established
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the request method is GET
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { id } = req.query;

    // Validate MongoDB ObjectId format
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    // Use `lean()` to return a plain object, not a Mongoose document
    const user = await User.findById(id).lean().exec() as IUser | null;

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return user data excluding sensitive fields
    return res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(), // Convert the ObjectId to string
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null, // Default null if not available
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(), // Serialize dates to ISO string
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching user:', error);

    // Return a server error response
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
