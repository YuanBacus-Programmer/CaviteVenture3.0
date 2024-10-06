"use client"
import ArrowIcon from "@/assets/HeaderImages/arrow-right.svg"
import Image from "next/image";
import cogImage from "@/assets/HeroImages/cog.png"
import cylinderImage from "@/assets/HeroImages/cylinder.png"
import noodleImage from "@/assets/HeroImages/noodle.png"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react";
import Link from 'next/link';

// Import the custom font for historical theme
import { Merriweather } from 'next/font/google';

const merriweather = Merriweather({
  weight: '400',
  subsets: ['latin'],
});

export const Hero = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start']
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section 
      ref={heroRef} 
      className={`pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#fae8b4,#EAEEFE_100%)] overflow-x-clip ${merriweather.className}`}
    >
      <div className="container px-4 mx-auto md:px-8 lg:px-16">
        <div className="md:flex items-center">
          {/* Left Section with content */}
          <div className="md:w-[478px]">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
              CaviteVenture 2.0 is here
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-6">
              Pathway to new modern Exhibit
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Explore with the app design to trace your progress, motivate your efforts
            </p>
            <div className="flex gap-4 items-center mt-[30px]">
              <Link href="/signup">
                <button className="btn btn-primary">Explore for Free</button>
              </Link>
              <button className="btn btn-text gap-2 flex items-center">
                <span>Learn More</span>
                <Image src={ArrowIcon} alt="Arrow icon" height={20} width={20} className="h-5 w-5"/>
              </button>
            </div>
          </div>

          {/* Right Section with Images */}
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <motion.img 
              src={cogImage.src} 
              alt="Cog Image - representing innovation" 
              className="md:absolute md:h-3/4 md:w-auto md:max-w-none md:-left-6 lg:left-0 rounded-lg"
              animate={{ translateY: [-30, 30] }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }} 
            />
            <motion.img 
              src={cylinderImage.src} 
              alt="Cylinder Image - symbolic art" 
              width={220} 
              height={220} 
              className="hidden md:block -top-8 -left-32 md:absolute rounded-lg"
              style={{
                translateY: translateY,
              }} 
            />
            <motion.img 
              src={noodleImage.src} 
              width={220} 
              height={220} 
              alt="Noodle Image - conceptual art" 
              className="hidden lg:block absolute top-[524px] left-[448px] rotate-[10deg] rounded-lg" 
              style={{
                translateY: translateY,
                rotate: 30,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
