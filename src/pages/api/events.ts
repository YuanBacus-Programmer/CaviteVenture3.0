// /pages/api/events.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/connectDB';
import Event from '@/model/Event';

// Disable the default bodyParser for this route to handle form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;

  // DELETE: Delete an event by ID
  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      console.log('Invalid ID received:', id);
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    try {
      const objectId = new ObjectId(id); // Convert the string ID to MongoDB ObjectId
      console.log('Attempting to delete event with ID:', objectId);

      const event = await Event.findByIdAndDelete(objectId);

      if (!event) {
        console.log('Event not found for ID:', objectId);
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ message: 'Error deleting event', error });
    }
  }

  // PUT: Update an event by ID
  if (req.method === 'PUT') {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    try {
      const objectId = new ObjectId(id);
      const { title, location, date, description, time, attendees, image } = req.body;

      if (!title || !location || !date || !description) {
        return res.status(400).json({ message: 'All fields are required for updating.' });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        objectId,
        { title, location, date, description, time, attendees, image },
        { new: true }
      );

      if (!updatedEvent) {
        console.log('Event not found for ID:', objectId);
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
      console.error('Error updating event:', error);
      return res.status(500).json({ message: 'Error updating event', error });
    }
  }

  // GET: Retrieve all events
  if (req.method === 'GET') {
    try {
      const events = await Event.find({});
      const transformedEvents = events.map((event) => ({
        ...event.toObject(),
        id: event._id.toString(),
      }));
      return res.status(200).json({ events: transformedEvents });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ message: 'Error fetching events', error });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
