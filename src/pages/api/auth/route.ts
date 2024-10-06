import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import User from '@/model/User';
import connectDB from '@/utils/connectDB';
import rateLimit from '@/utils/rateLimit';
import { emailValidator, passwordValidator } from '@/utils/validators';

type Data = {
  message?: string;
};

// Rate limiting to prevent spamming
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per 15 minutes
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    await limiter(req, res);

    const { firstName, lastName, email, password } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate email and password
    if (!emailValidator(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!passwordValidator(password)) {
      return res.status(400).json({ message: 'Password does not meet the required criteria' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      isVerified: false,
    });

    // Generate and save the verification code
    const verificationCode = newUser.generateVerificationCode();
    await newUser.save();

    // Setup Gmail SMTP configuration using Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // SSL
      secure: true, // True for SSL
      auth: {
        user: process.env.EMAIL_USER, // Gmail email address
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (your Gmail)
      to: email, // Receiver's email
      subject: 'Email Verification Code',
      text: `Your verification code is: ${verificationCode}. It will expire in 1 hour.`,
    };

    // Send verification email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    return res.status(201).json({ message: 'User registered, please verify your email' });
  } catch (error) {
    console.error('Error during user signup:', error);

    if (error instanceof Error && 'response' in error) {
      const err = error as { response: { status: number } };
      if (err.response?.status === 429) {
        return res.status(429).json({ message: 'Too many requests. Please try again later.' });
      }
    }

    // General error handling
    return res.status(500).json({ message: 'Server error' });
  }
}
