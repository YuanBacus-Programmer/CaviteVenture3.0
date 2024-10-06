"use client"

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Binakayan from '@/assets/HeroImages/cog.png'
import Sanroque from '@/assets/HeroImages/noodle.png'
import Rosario from '@/assets/HeroImages/cylinder.png'

const images = [
  { src: Binakayan, alt: "Binakayan", title: "Discover Binakayan", description: "Explore the rich history and culture of Binakayan" },
  { src: Sanroque, alt: "San Roque", title: "Experience San Roque", description: "Immerse yourself in the vibrant traditions of San Roque" },
  { src: Rosario, alt: "Rosario", title: "Uncover Rosario", description: "Unveil the hidden gems and natural beauty of Rosario" }
]

const Dashboard1: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 })

  const textY = useTransform(smoothProgress, [0, 1], [0, -100])
  const textOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [1, 0, 0, 1])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div ref={containerRef} className="min-h-[300vh] bg-white text-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div 
          className="absolute top-0 inset-0 flex flex-col items-center justify-center z-10"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="text-4xl md:text-6xl font-light mb-12 tracking-widest text-center text-white">
            A JOURNEY THROUGH ARTS
          </h1>
        </motion.div>

        {/* "Scroll down to learn more" Text */}
        <motion.div
          className="absolute top-1/2 transform -translate-y-1/2 w-full text-center text-white text-lg md:text-2xl font-light"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }} // Fade out as you scroll
        >
          Scroll down to learn more
        </motion.div>

        {images.map((image, index) => (
          <motion.div
            key={image.alt}
            className="absolute inset-0"
            style={{
              // eslint-disable-next-line react-hooks/rules-of-hooks
              opacity: useTransform(
                smoothProgress,
                [index / images.length, (index + 0.3) / images.length, (index + 0.7) / images.length, (index + 1) / images.length],
                [0, 1, 1, 0]
              ),
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
            />
          </motion.div>
        ))}

        {images.map((image, index) => (
          <motion.div
            key={image.alt + "-text"}
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
            style={{
              // eslint-disable-next-line react-hooks/rules-of-hooks
              opacity: useTransform(
                smoothProgress,
                [index / images.length, (index + 0.3) / images.length, (index + 0.7) / images.length, (index + 1) / images.length],
                [0, 1, 1, 0]
              ),
              // eslint-disable-next-line react-hooks/rules-of-hooks
              y: useTransform(
                smoothProgress,
                [index / images.length, (index + 1) / images.length],
                [50, -50]
              ),
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
              {image.title}
            </h2>
            <p className="text-xl md:text-2xl text-center max-w-2xl px-4">
              {image.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard1
