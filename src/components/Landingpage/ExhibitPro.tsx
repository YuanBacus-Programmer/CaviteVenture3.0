"use client";
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Iconmap from '@/assets/ExhibitProImages/iconmapremove.png';
import Iconround from '@/assets/ExhibitProImages/iconround.png';

const Exhibitpro: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    if (hoveredCard !== cardId) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2, 
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
  };

  const handleMouseEnter = (cardId: number) => {
    setHoveredCard(cardId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null); 
  };

  return (
    <section className="mb-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="tag">Everything you need to explore</div>
        </div>
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-5">
          Explore both 3D and Augmented reality
        </h2>
        <p className="text-center text-sm sm:text-base md:text-lg lg:text-[22px] leading-5 sm:leading-6 md:leading-7 lg:leading-[30px] tracking-tight text-[#80775c] mt-5">
          Enjoy exploring the History of Cavite in your own hands both 3D and AR experience a modern discovery of the past by Cavite Venture.
        </p>
        <motion.div
          className="flex flex-wrap justify-center mt-10 gap-10"
          initial="hidden"
          animate="visible"
        >
          {/* 3D Museum Card */}
          <Link href="/signup" passHref>
            <motion.div
              ref={(el) => { containerRefs.current[1] = el; }}
              className="bg-white shadow-xl rounded-xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] relative overflow-hidden cursor-pointer p-5 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-500"
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.05 }}
              custom={1}
              variants={cardVariants}
            >
              <Image 
                src={Iconmap} 
                width={200} 
                height={200} 
                alt="3D Museum" 
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px" 
                priority
              />
              <h3 className="text-center mt-4 font-bold text-base sm:text-lg md:text-xl">3D Museum</h3>
              <p className="text-center mt-2 text-sm sm:text-base md:text-lg text-[#80775c]">
                Lets explore Cavite in a museum in 3D and interact with the 3D elements.
              </p>
              {hoveredCard === 1 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.6), transparent 200px)`,
                  }}
                />
              )}
            </motion.div>
          </Link>

          {/* Augmented Reality Card */}
          <Link href="/signup" passHref>
            <motion.div
              ref={(el) => { containerRefs.current[2] = el; }}
              className="bg-white shadow-xl rounded-xl w-full sm:w-[300px] md:w-[400px] lg:w-[500px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] relative overflow-hidden cursor-pointer p-5 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-500"
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.05 }}
              custom={2}
              variants={cardVariants}
            >
              <Image 
                src={Iconround} 
                width={200} 
                height={200} 
                alt="Augmented Reality" 
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
                priority={false} 
              />
              <h3 className="text-center mt-4 font-bold text-base sm:text-lg md:text-xl">Augmented Reality</h3>
              <p className="text-center mt-2 text-sm sm:text-base md:text-lg text-[#80775c]">
                Explore the amazing features of Cavite Venture and let us see what the past holds.
              </p>
              {hoveredCard === 2 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(203, 189, 147, 0.6), transparent 200px)`,
                  }}
                />
              )}
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Exhibitpro;
