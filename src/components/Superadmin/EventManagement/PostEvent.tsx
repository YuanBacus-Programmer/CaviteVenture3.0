'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  attendees: number;
  image: string;
  description: string;
}

const PostEvent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleModalClose = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return <div className="text-[#5c4813] font-serif">Loading historical events...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fae8b4] text-[#5c4813] p-8 font-serif">
      <motion.h1
        className="text-5xl font-bold mb-8 text-center text-[#5c4813]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Historical Events
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-[#f5d78e] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 relative group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#5c4813] bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="bg-[#fae8b4] text-[#5c4813] px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-200 font-bold"
                  >
                    Uncover History
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                <div className="flex items-center space-x-2 text-[#5c4813] mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#5c4813] mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#5c4813] mb-2">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-[#5c4813]">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} historical enthusiasts</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f5d78e] to-[#fae8b4] opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
          >
            <button
              onClick={handleModalClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
            <div className="flex items-center space-x-2 text-[#5c4813] mb-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(new Date(selectedEvent.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#5c4813] mb-2">
              <MapPin className="h-4 w-4" />
              <span>{selectedEvent.location}</span>
            </div>
            <p className="text-[#5c4813] mb-4">{selectedEvent.description}</p>
            <button
              onClick={handleModalClose}
              className="bg-[#fae8b4] text-[#5c4813] px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors duration-200 font-bold"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PostEvent;
