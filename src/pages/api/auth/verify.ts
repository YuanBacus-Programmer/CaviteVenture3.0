import type { NextApiRequest, NextApiResponse } from 'next';
import User from '@/model/User';
import connectDB from '@/utils/connectDB';

type Data = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, code } = req.body;

  console.log('Incoming request data:', { email, code });

  // Validate input
  if (!email || !code) {
    console.error('Missing email or verification code');
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log('User found:', user);

    // Check if user exists
    if (!user) {
      console.error('User not found with email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Log verification code details
    console.log('Stored verification code:', user.verificationCode);
    console.log('Stored verification code expiration:', user.verificationCodeExpires);

    // Check if the verification code matches
    if (user.verificationCode !== code) {
      console.error('Invalid verification code provided');
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if the verification code has expired
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      console.error('Verification code has expired');
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.verificationCode = undefined; // Remove the verification code after success
    user.verificationCodeExpires = undefined; // Remove expiration date

    await user.save();

    console.log('User verified successfully:', user.email);
    return res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Error during verification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
