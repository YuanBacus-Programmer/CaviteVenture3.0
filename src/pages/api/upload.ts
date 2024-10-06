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

// Define the directory to store uploaded files
const uploadDir = path.join(process.cwd(), '/public/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Max file size for uploads in bytes (2MB here)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Setup formidable with max file size and target upload directory
    const form = formidable({
      uploadDir,
      keepExtensions: true, // Keep the file extension of the uploaded file
      maxFileSize: MAX_FILE_SIZE, // Limit the file size to prevent abuse
      filter: ({ mimetype }) => {
        // Allow only image types (jpg, png, etc.)
        return Boolean(mimetype && mimetype.includes('image')); // Return boolean
      },
    });

    // Helper function to parse the form data
    const parseForm = () => {
      return new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
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
    const file = Array.isArray(files.profilePicture) ? files.profilePicture[0] : files.profilePicture as formidable.File | undefined;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Verify file size is within the limit
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ success: false, message: `File too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.` });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(file.newFilename).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed (jpg, jpeg, png, gif).' });
    }

    const imageUrl = `/uploads/${file.newFilename}`;

    // Update the user's profile picture in the database
    const user = await User.findByIdAndUpdate(userId, { profilePicture: imageUrl }, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Return the response with the new image URL
    return res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in the upload handler:', error); // Use the error
    return res.status(500).json({ success: false, message: 'Server error during file upload.' });
  }
}
