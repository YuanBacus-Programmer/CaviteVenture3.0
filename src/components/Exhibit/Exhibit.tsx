"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkedAlt, FaVrCardboard, FaArrowRight } from 'react-icons/fa';
import Iconmap from '@/assets/iconmapremove.png';
import Iconround from '@/assets/iconround.png';

const Exhibitpro: React.FC = () => {
  const [hoveredContainer, setHoveredContainer] = useState<number | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.3 } }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  const exhibits = [
    {
      id: 1,
      title: "3D Virtual Museum",
      icon: FaVrCardboard,
      image: Iconmap,
      description: "Lets explore Cavite in a museum in 3D and interact with the 3D elements.",
      features: [
        "Interactive 3D artifacts with detailed historical information",
        "360° panoramic views of reconstructed historical sites",
        "Guided virtual tours with expert narration and historical reenactments",
        "Time-lapse visualizations showing the evolution of Cavite through centuries"
      ]
    },
    {
      id: 2,
      title: "Augmented Reality Experience",
      icon: FaMapMarkedAlt,
      image: Iconround,
      description: "Explore the amazing features of Cavite Venture and discover what the past holds.",
      features: [
        "Overlay historical scenes on modern locations using your device's camera",
        "Interact with lifelike virtual historical figures from Cavite's past",
        "Uncover hidden stories and artifacts with AR-powered treasure hunts",
        "Visualize historical events and battles in real-time 3D simulations"
      ]
    }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, containerId: number) => {
    if (hoveredContainer !== containerId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <section className="min-h-screen bg-[#fae8b4] text-[#5c4813] py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-6xl font-bold text-center mb-4 font-serif"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Start Exploring
        </motion.h1>
        <motion.p 
          className="text-2xl text-center mb-12 font-light"
          variants={descriptionVariants}
          initial="hidden"
          animate="visible"
        >
          Navigate all in your own desire experience like you never expect
        </motion.p>

        <div className="flex justify-center mb-8">
          <div className="tag bg-[#5c4813] text-white px-4 py-2 rounded-full text-lg">Everything you need to explore</div>
        </div>

        <h2 className="text-center text-5xl font-bold mb-4 bg-gradient-to-b from-[#5c4813] to-[#cbbd93] text-transparent bg-clip-text">
          Explore both 3D and Augmented Reality
        </h2>
        <p className="text-center text-xl mb-12 text-[#80775c]">
          Enjoy exploring the History of Cavite in your own hands with both 3D and AR experiences, a modern discovery of the past by Cavite Venture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {exhibits.map((exhibit) => (
            <motion.div
              key={exhibit.id}
              className="bg-white shadow-xl rounded-lg overflow-hidden cursor-pointer relative"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onMouseEnter={() => setHoveredContainer(exhibit.id)}
              onMouseLeave={() => setHoveredContainer(null)}
              onMouseMove={(e) => handleMouseMove(e, exhibit.id)}
              onClick={() => setSelectedExhibit(exhibit.id)}
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={exhibit.image} 
                  layout="fill" 
                  objectFit="contain" 
                  alt={exhibit.title} 
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-[#5c4813] to-transparent"
                  variants={overlayVariants}
                  initial="hidden"
                  animate={hoveredContainer === exhibit.id ? "visible" : "hidden"}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                  <exhibit.icon className="mr-2" />
                  {exhibit.title}
                </h3>
                <p className="text-lg mb-4 text-[#80775c]">
                  {exhibit.description}
                </p>
                <motion.button
                  className="mt-4 bg-[#5c4813] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#7c6833] transition-colors duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore <FaArrowRight className="ml-2" />
                </motion.button>
              </div>
              {hoveredContainer === exhibit.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.6), transparent 200px)`,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedExhibit && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedExhibit(null)}
          >
            <motion.div
              className="bg-white p-8 rounded-lg max-w-2xl w-full m-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold mb-4 text-[#5c4813]">
                {exhibits[selectedExhibit - 1].title}
              </h3>
              <p className="text-lg mb-4 text-[#5c4813]">
                {exhibits[selectedExhibit - 1].description}
              </p>
              <h4 className="text-xl font-semibold mb-2 text-[#5c4813]">Key Features:</h4>
              <ul className="list-disc list-inside text-[#5c4813]">
                {exhibits[selectedExhibit - 1].features.map((feature, index) => (
                  <li key={index} className="mb-2">{feature}</li>
                ))}
              </ul>
              <motion.button
                className="mt-6 bg-[#5c4813] text-white px-6 py-2 rounded-full text-lg font-semibold hover:bg-[#7c6833] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedExhibit(null)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Exhibitpro;