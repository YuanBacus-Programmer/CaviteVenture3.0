import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB'; // Utility function to connect to your database
import User from '@/model/User'; // User model

// Extend NextApiRequest to include user property
interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
  };
}

// Connect to the database
connectDB();

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const userId = req.user?.id || 'mock-user-id'; // This assumes you are using a session or token-based auth

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user's profile data
    return res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || '/default-profile.png',
      },
    });
  } catch (error) {
    // Return a detailed error message
    return res.status(500).json({ success: false, message: (error as Error).message });
  }
}
