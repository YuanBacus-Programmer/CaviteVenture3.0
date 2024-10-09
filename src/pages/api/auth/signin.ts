import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { setCookie } from 'nookies';
import { z } from 'zod';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import rateLimit from '@/utils/rateLimit';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Data = {
  token?: string;
  message?: string;
  errors?: z.ZodIssue[];
};

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute per IP
  uniqueTokenPerInterval: 500,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await limiter(req, res);

    // Connect to the database
    await connectDB();

    // Parse and validate request data
    const { email, password } = signInSchema.parse(req.body);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedPassword = password.trim();

    console.log('Sign-in attempt for:', sanitizedEmail);

    // Find the user by email
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      console.log(`User not found for email: ${sanitizedEmail}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`Stored hash for user ${sanitizedEmail}: ${user.password}`);

    // Compare the sanitized password with the stored hash
    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    console.log('Is password match:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for user:', sanitizedEmail);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Set the JWT token as an HTTP-only cookie
    setCookie({ res }, 'token', token, {
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    console.log(`Sign-in successful for user: ${sanitizedEmail}`);
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    console.error('Error during sign-in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
//update