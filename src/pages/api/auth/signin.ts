import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { setCookie } from 'nookies'; // Optionally use nookies to set cookies
import connectDB from '@/utils/connectDB';
import User from '@/model/User'; // Ensure the User model is correct

type Data = {
  token?: string;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected successfully.');

    // Extract email and password from the request body and sanitize inputs
    const { email, password } = req.body;
    console.log('Incoming request data:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Trim email and password to avoid accidental whitespaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Find the user in the database by email
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      console.log(`User not found with email: ${trimmedEmail}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log the stored password hash for debugging purposes
    console.log('Stored password hash:', user.password);

    // Compare the entered password with the stored hashed password using bcrypt
    const isMatch = await bcrypt.compare(trimmedPassword, user.password); // Use bcrypt to compare password
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token upon successful login, include additional user info (email, role, firstName, lastName) in the payload
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET!, // Ensure JWT_SECRET is set in environment variables
      { expiresIn: '1h' }
    );

    // Optionally: Set the JWT token in an HTTP-only cookie
    setCookie({ res }, 'token', token, {
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,  // Secure the cookie
      path: '/',       // Allow the cookie to be available on all routes
    });

    // Respond with the token in the JSON body (optional, you can remove this if only using cookies)
    return res.status(200).json({ token });

  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
