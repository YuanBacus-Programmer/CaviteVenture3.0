// /pages/api/events/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import connectDB from '@/utils/connectDB';
import Event from '@/model/Event';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }

    try {
      const objectId = new ObjectId(id);
      const event = await Event.findByIdAndDelete(objectId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      return res.status(500).json({ message: 'Error deleting event', error });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
