import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import rateLimit from '@/utils/rateLimit';

const resetPasswordSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().min(6),
  newPassword: z.string().min(8),
});

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  uniqueTokenPerInterval: 500,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply rate limiting before proceeding
    await limiter(req, res);

    await connectDB();

    // Parse and validate the request body
    const { email, verificationCode, newPassword } = resetPasswordSchema.parse(req.body);

    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedVerificationCode = verificationCode.trim();

    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      console.log(`User not found for email: ${sanitizedEmail}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check the validity of the verification code and its expiration
    if (
      !user.verificationCodeExpires ||
      user.verificationCode !== sanitizedVerificationCode ||
      user.verificationCodeExpires < new Date()
    ) {
      console.log('Invalid or expired verification code for user:', sanitizedEmail);
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Hash the new password with bcrypt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword.trim(), saltRounds);
    console.log('New password hashed successfully for user:', sanitizedEmail);

    // Update the user's password and reset verification code fields
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.passwordLastChanged = new Date();

    await user.save();

    console.log(`Password reset successfully for user: ${sanitizedEmail}`);
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
