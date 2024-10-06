import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Ensure MongoDB is connected
connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { token, firstName, lastName, email, profilePicture } = req.body; // Include profilePicture
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT secret is not defined' });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId?: string };

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const { userId } = decoded;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields (firstName, lastName, email, and profilePicture)
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture; // Ensure profilePicture is updated

    await user.save();

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
