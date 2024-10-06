"use client";
import React from "react";
import acmeLogo from "@/assets/LogoTickerImages/logo-acme.png";
import quantumLogo from "@/assets/LogoTickerImages/logo-quantum.png";
import echoLogo from "@/assets/LogoTickerImages/logo-echo.png";
import celestialLogo from "@/assets/LogoTickerImages/logo-celestial.png";
import Image from "next/image";
import { motion } from "framer-motion";

export const LogoTicker: React.FC = () => {
  const logos = [
    { src: acmeLogo, alt: "Acme Logo" },
    { src: quantumLogo, alt: "Quantum Logo" },
    { src: echoLogo, alt: "Echo Logo" },
    { src: celestialLogo, alt: "Celestial Logo" },
  ];

  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container mx-auto">
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <motion.div
            className="flex gap-8 sm:gap-10 md:gap-14 lg:gap-20 flex-none pr-8 sm:pr-10 md:pr-14"
            animate={{
              translateX: ["0%", "-100%"],
            }}
            transition={{
              duration: 30, // Optimized duration for smooth animation
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: "transform" }} // Enhances animation performance
          >
            {/* Duplicate logos to create continuous ticker */}
            {logos.concat(logos).map((logo, index) => (
              <Image
                key={index}
                src={logo.src}
                alt={logo.alt}
                className="logo-ticker-image object-contain"
                priority={index < 4} // Use priority for the first set of images
                width={120}
                height={80}
                sizes="(max-width: 640px) 80px, 
                       (max-width: 768px) 100px, 
                       120px"
                // Automatically lazy loads non-priority images for performance
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
