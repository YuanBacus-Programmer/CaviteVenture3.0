"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Shrine from '@/components/About/shrine/Shrine';
import iconUrl from '@/assets/AboutMainImages/checkicon.png'

const AboutUs = () => {
  const controls = useAnimation();

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const sections = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            controls.start('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [controls]);

  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore');
    exploreSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Framer Motion variants for hover animation
  const cardVariants = {
    hover: {
      scale: 1.1,
      rotateY: 5,
      rotateX: -5,
      boxShadow: '0px 15px 30px rgba(0,0,0,0.3)',
      transition: { duration: 0.5 },
    },
    rest: {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
      transition: { duration: 0.5 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // Data for places section
  const places = [
    { id: 1, title: "Bacoor", description: "Bacoor is a rapidly urbanizing city in Cavite, Philippines, known for its historical significance in the Philippine Revolution and its proximity to Metro Manila." },
    { id: 2, title: "Binakayan", description: "Binakayan is a historic district in Kawit, Cavite, known for its role in the Philippine Revolution, particularly the Battle of Binakayan." },
    { id: 3, title: "Rosario", description: "Rosario is a coastal town in Cavite, Philippines, known for its thriving fishing industry and rich cultural heritage." },
    { id: 4, title: "Cavite City", description: "Cavite City is a historic port city in Cavite, Philippines, known for its role in the Philippine Revolution and its rich colonial heritage." },
  ];

  return (
    <div 
      className="w-full min-h-screen bg-gradient-to-bl from-[#fae8b4] to-[#EAEEFE]" 
      style={{ backgroundSize: 'cover', width: '100vw', overflowX: 'hidden' }}
    >
      {/* Hero Section */}
      <motion.div 
        initial="hidden" 
        animate={controls} 
        variants={fadeIn} 
        className="hero-section flex flex-col md:flex-row justify-center items-center min-h-screen text-left space-y-8 md:space-y-0 fade-in"
      >
        <div className="flex-1 px-5 md:px-20 lg:px-32">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-center font-bold font-serif text-gray-800" 
            style={{ fontFamily: "'Playfair Display', serif" }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            We Are CodeBreakers
          </motion.h1>
          <motion.p 
            className="text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-center mt-5 text-gray-600 leading-relaxed" 
            style={{ fontFamily: "'Roboto', sans-serif" }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to Cavite Venture, your gateway to the hidden gems of Cavite! We are passionate about uncovering and promoting the lesser-known historical and attraction sites across selected municipalities in Cavite.
          </motion.p>
          {/* Modern CTA Button */}
          <div className="text-center mt-10">
            <motion.button
              onClick={scrollToExplore}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg"
            >
              Explore More
            </motion.button>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <Shrine />
        </div>
      </motion.div>

      {/* Places Section with AnimatePresence */}
      <div id="explore" className="fourplaces grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center mt-16 px-8 fade-in">
        <AnimatePresence>
          {places.map((place) => (
            <motion.div
              key={place.id}
              className="animate-paragraph border-2 border-gray-300 p-6 rounded-lg relative w-full h-64 bg-white shadow-lg transition-shadow duration-300 ease-in-out"
              style={{ fontFamily: "'Roboto', sans-serif" }}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              exit={{ opacity: 0, scale: 0.9 }}  // Add exit animation for AnimatePresence
            >
              <Image
                src={iconUrl}
                alt="Icon"
                width={40}
                height={40}
                loading="lazy"
                className="absolute top-2 left-2"
              />
              <h2 className="font-serif text-xl mt-4 font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{place.title}</h2>
              <p className="text-sm mt-2 text-gray-600">{place.description}</p>
              {/* Add an Explore button */}
              <motion.a 
                href="#" 
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Explore
              </motion.a>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AboutUs;
