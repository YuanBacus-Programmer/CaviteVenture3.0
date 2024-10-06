// /pages/api/events.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/utils/connectDB';
import Event from '@/model/Event';
import { IncomingForm, Fields, Files } from 'formidable';
import path from 'path';
import { promises as fsPromises } from 'fs';

// Disable the default bodyParser for this route to handle form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); // Ensure MongoDB is connected before handling any requests

  if (req.method === 'POST') {
    // POST request logic for creating a new event
    const form = new IncomingForm();

    form.parse(req, async (err, fields: Fields, files: Files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing the form' });
      }

      // Extract form fields safely
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const location = Array.isArray(fields.location) ? fields.location[0] : fields.location;
      const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;

      if (!title || !location || !date || !description || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        // Handle the uploaded image file
        let imageUrl = '';
        const imageFile = files.image;
        if (imageFile) {
          const image = Array.isArray(imageFile) ? imageFile[0] : imageFile;

          const tempPath = image.filepath;
          const imageBuffer = await fsPromises.readFile(tempPath);

          // Save image to a static folder (e.g., /public/uploads)
          const targetPath = path.join(process.cwd(), 'public', 'uploads', image.originalFilename as string);
          await fsPromises.writeFile(targetPath, imageBuffer);

          imageUrl = `/uploads/${image.originalFilename}`;
        }

        // Save the new event to the database
        const newEvent = new Event({
          title,
          location,
          date,
          description,
          email,
          image: imageUrl,
        });

        await newEvent.save();

        return res.status(201).json({ message: 'Event created successfully', event: newEvent });
      } catch (error) {
        return res.status(500).json({ message: 'Error saving event', error });
      }
    });

  } else if (req.method === 'GET') {
    // GET request logic for fetching events
    try {
      const events = await Event.find({});
      res.status(200).json({ events });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }

  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
