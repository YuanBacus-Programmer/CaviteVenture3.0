import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File, Part } from 'formidable'; // Explicitly import types
import fs from 'fs';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Cors from 'cors';

// Initialize CORS
const cors = Cors({
  methods: ['POST'], // Only allow POST method
  origin: '*', // Replace '*' with your frontend domain for security
});

// Apply CORS middleware with correct types
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: Cors.CorsRequest, res: NextApiResponse, next: (err?: unknown) => void) => void // Explicit typing for next and err
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve();
    });
  });
}

// Disable body parsing to allow formidable to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure MongoDB connection
connectDB();

// Max file size for uploads (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Setup formidable for file upload parsing
    const form = formidable({
      keepExtensions: true, // Keep file extension
      maxFileSize: MAX_FILE_SIZE, // Limit file size to 2MB
      filter: ({ mimetype }: Part): boolean => {
        return !!(mimetype && mimetype.includes('image')); // Ensure only boolean is returned
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

    // Ensure token is provided
    const token = fields.token?.toString();
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token provided' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT secret is not defined' });
    }

    // Verify the token
    let decoded: JwtPayload & { userId?: string };
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId?: string };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const { userId } = decoded;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Handle the file upload
    const file = Array.isArray(files.profilePicture) ? files.profilePicture[0] : (files.profilePicture as unknown as File);
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
    return res.status(200).json({ success: true, message: 'Profile picture updated successfully!' });
  } catch (error) {
    console.error('Error during file upload:', error);
    return res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
}
