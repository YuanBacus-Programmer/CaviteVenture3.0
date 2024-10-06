import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Cors from 'cors'; // Use CORS for handling cross-origin requests

// Install TypeScript types: npm install --save-dev @types/cors

// Initialize the cors middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*', // Replace with your frontend domain for production (e.g., 'https://yourdomain.com')
});

// Helper method to apply CORS middleware with typed function
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, result: (result: unknown) => void) => void) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
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

// Max file size for uploads in bytes (2MB here)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Setup formidable with max file size
    const form = formidable({
      keepExtensions: true, // Keep the file extension of the uploaded file
      maxFileSize: MAX_FILE_SIZE, // Limit the file size to prevent abuse
      filter: ({ mimetype }) => {
        // Allow only image types (jpg, png, etc.)
        return Boolean(mimetype && mimetype.includes('image')); // Return boolean
      },
    });

    // Helper function to parse the form data
    const parseForm = (): Promise<{ fields: formidable.Fields, files: formidable.Files }> => {
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
      return res.status(400).json({ success: false, message: 'No token provided.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    let decoded: JwtPayload & { userId?: string };
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId?: string };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
    }

    const { userId } = decoded;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
    }

    // Handle the file upload
    const file = Array.isArray(files.profilePicture) ? files.profilePicture[0] : (files.profilePicture as formidable.File | undefined);

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Verify file size is within the limit
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ success: false, message: `File too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.` });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = file.originalFilename?.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension || '')) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed (jpg, jpeg, png, gif).' });
    }

    // Convert the file to a binary buffer
    const fileBuffer = fs.readFileSync(file.filepath);

    // Update the user's profile picture in the database (store the binary data)
    const user = await User.findByIdAndUpdate(userId, { profilePicture: fileBuffer }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Return the response
    return res.status(200).json({ success: true, message: 'Profile picture updated successfully!' });
  } catch (error) {
    // Log the error for debugging purposes
    if (error instanceof Error) {
      console.error('Error in the upload handler:', error.message);
    } else {
      console.error('Unknown error in the upload handler:', error);
    }
    return res.status(500).json({ success: false, message: 'Server error during file upload.' });
  }
}
