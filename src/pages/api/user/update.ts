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
    const { token, firstName, lastName, email, profilePicture } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT secret is not defined' });
    }

    let decoded: JwtPayload & { userId?: string };

    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId?: string };
    } catch (err) {
      // Narrow the type of the error using `instanceof` and safely handle the error
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ success: false, message: 'Token has expired' });
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      } else {
        console.error('Unexpected error during JWT verification:', err);
        return res.status(500).json({ success: false, message: 'Unexpected token error' });
      }
    }

    const { userId } = decoded;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Find the user by ID in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate and update fields
    if (firstName && typeof firstName === 'string') {
      user.firstName = firstName;
    }

    if (lastName && typeof lastName === 'string') {
      user.lastName = lastName;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && typeof email === 'string' && emailRegex.test(email)) {
      user.email = email;
    } else if (email) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check if profilePicture is a base64 string and convert it to Buffer
    if (profilePicture && typeof profilePicture === 'string') {
      // If it's base64 encoded, remove the 'data:image/jpeg;base64,' prefix if it exists
      const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
      user.profilePicture = Buffer.from(base64Data, 'base64'); // Convert base64 to Buffer
    }

    // Save the updated user profile to the database
    await user.save();

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    // Since error is unknown, we use type narrowing for logging and error handling
    if (error instanceof Error) {
      console.error('Error updating profile:', error.message);
    } else {
      console.error('An unknown error occurred during profile update:', error);
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
