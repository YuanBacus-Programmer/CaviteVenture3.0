import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectDB from '../../../utils/connectDB';
import User from '@/model/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Ensure database connection
  await connectDB();

  const { email, verificationCode, newPassword } = req.body;

  // Log incoming data for debugging
  console.log('Request body:', req.body);

  // Basic validation to ensure required fields are present
  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Trim email and verificationCode to remove leading/trailing spaces and use case-insensitive search
    const sanitizedEmail = email.trim();
    const sanitizedVerificationCode = verificationCode.trim(); // Trim any spaces in the verification code

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: new RegExp(`^${sanitizedEmail}$`, 'i') });

    // Check if user was found
    if (!user) {
      console.log(`User not found with email: ${sanitizedEmail}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if verificationCodeExpires is defined and if the code is still valid
    if (
      !user.verificationCodeExpires ||
      user.verificationCode !== sanitizedVerificationCode || // Compare sanitized code
      user.verificationCodeExpires < new Date() // Ensure the code hasn't expired
    ) {
      console.log('Invalid or expired verification code');
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Hash the new password using bcrypt with 10 salt rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the user's password
    user.password = hashedPassword;
    
    // Set verificationCode and verificationCodeExpires to undefined after successful password update
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    // Save the updated user
    await user.save(); 

    // Send success response
    res.status(200).json({ message: 'Password reset successfully for user with email ' + sanitizedEmail });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
