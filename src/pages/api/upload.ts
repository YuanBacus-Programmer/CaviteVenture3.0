import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Part } from 'formidable'; // Explicitly import types
import fs from 'fs';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Cors from 'cors'; // Use CORS for handling cross-origin requests

// Initialize the CORS middleware
const cors = Cors({
  methods: ['POST'], // Only allow POST method
  origin: '*', // Replace '*' with your frontend domain for security in production
});

// Helper method to apply CORS middleware with typed function
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, result: (result: unknown) => void) => void) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
}

// Disable body parsing to allow formidable to handle file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

// Ensure MongoDB connection
connectDB();

// Maximum file size for uploads (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Setup formidable to handle file uploads
    const form = formidable({
      keepExtensions: true,
      maxFileSize: MAX_FILE_SIZE,
      filter: ({ mimetype }: Part) => {
        // Return only boolean instead of boolean | string | null
        return !!(mimetype && mimetype.includes('image'));
      },
    });

    // Helper function to parse the form data
    const parseForm = (): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
    };

    // Parse the form data
    const { fields, files } = await parseForm();

    // Extract and verify the token
    const token = fields.token?.toString();
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT secret not configured' });
    }

    // Decode and verify JWT
    let decoded: JwtPayload & { userId?: string };
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId?: string };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const { userId } = decoded;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Handle file upload, ensuring the correct type for file
    const file = Array.isArray(files.profilePicture) ? files.profilePicture[0] : (files.profilePicture as File | undefined);

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ success: false, message: `File too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB` });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.originalFilename?.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension || '')) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed' });
    }

    // Convert file to binary buffer
    const fileBuffer = fs.readFileSync(file.filepath);

    // Update user's profile picture
    user.profilePicture = fileBuffer;
    await user.save();

    // Return success response
    return res.status(200).json({ success: true, message: 'Profile picture updated successfully' });
  } catch (error) {
    // Log and handle error
    if (error instanceof Error) {
      console.error('Error during file upload:', error.message);
    } else {
      console.error('Unknown error during file upload:', error);
    }
    return res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
}
