import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import connectDB from '@/utils/connectDB';
import User from '@/model/User';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Disable body parsing to allow formidable to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure MongoDB connection
connectDB();

const uploadDir = path.join(process.cwd(), '/public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const form = formidable({ uploadDir, keepExtensions: true });

    // Wrap formidable's form parsing in a promise to handle async/await
    const parseForm = () => {
      return new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
    };

    const { fields, files } = await parseForm();

    const token = fields.token?.toString();  // Ensure token is a string

    if (!token) {
      console.error('Token not provided.');
      return res.status(400).json({ success: false, message: 'No token provided.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT secret is missing in environment variables.');
      return res.status(500).json({ success: false, message: 'Server configuration error: Missing JWT secret.' });
    }

    let decoded: JwtPayload & { userId?: string };
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload & { userId?: string };
    } catch (err) {
      console.error('Invalid token:', err);
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
    }

    const { userId } = decoded;

    if (!userId) {
      console.error('User ID missing in token.');
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.' });
    }

    // Handle file being either File or File[]
    const file = Array.isArray(files.profilePicture) ? files.profilePicture[0] : files.profilePicture as formidable.File | undefined;

    if (!file) {
      console.error('No file uploaded.');
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const imageUrl = `/uploads/${file.newFilename}`;

    // Update the user's profile with the new profile picture URL
    const user = await User.findByIdAndUpdate(userId, { profilePicture: imageUrl }, { new: true });

    if (!user) {
      console.error('User not found for userId:', userId);
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Make sure to send a response
    return res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error during file upload:', error);
    return res.status(500).json({ success: false, message: 'Server error during file upload.' });
  }
}
