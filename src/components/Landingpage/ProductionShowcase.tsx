"use client";
import productImage from "@/assets/ProductionShowcaseImage/product-image.png";
import pyramidImage from "@/assets/ProductionShowcaseImage/pyramid.png";
import tubeImage from "@/assets/ProductionShowcaseImage/tube.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#FFFFFF] to-[#fae8b4] py-24 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-[540px] mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="tag font-cinzel">Discover About Cavite</div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[54px] md:leading-[60px] font-bold tracking-tight bg-gradient-to-b from-black to-[#cbbd93] text-transparent bg-clip-text mt-5 font-cinzel">
            A more effective way to explore Cavite
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-[#80775c] mt-5 font-cinzel">
            Effortlessly explore some parts of unpopular places in Cavite
          </p>
        </div>
        <div className="relative mt-10 flex justify-center">
          <Image
            src={productImage}
            alt="Showcase of a product representing Cavite exploration"
            className="mt-10 mx-auto rounded-lg"
            priority
            width={1200} // Reduced image size for better performance
            height={675}  // Aspect ratio maintained (16:9)
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          {/* Floating pyramid image for medium and large screens */}
          <motion.div
            className="hidden md:block absolute -right-20 lg:-right-36 -top-20 lg:-top-32"
            style={{ translateY }}
            initial={{ opacity: 0, translateY: 150 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            will-change="transform"
          >
            <Image
              src={pyramidImage}
              alt="Pyramid image"
              width={300} // Reduced image size
              height={300} // Keep aspect ratio
              sizes="(max-width: 768px) 50vw, 300px"
            />
          </motion.div>
          {/* Floating tube image for medium and large screens */}
          <motion.div
            className="hidden md:block absolute bottom-16 lg:bottom-24 -left-20 lg:-left-36"
            style={{ translateY }}
            initial={{ opacity: 0, translateY: 150 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            will-change="transform"
          >
            <Image
              src={tubeImage}
              alt="Tube image"
              width={300} // Reduced image size
              height={300} // Keep aspect ratio
              sizes="(max-width: 768px) 50vw, 300px"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
