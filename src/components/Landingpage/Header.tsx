"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/HeaderImages/logosaas.png";
import MenuIcon from "@/assets/HeaderImages/menu.svg";
import CloseIcon from "@/assets/HeaderImages/close.svg";
import ArrowRight from "@/assets/HeaderImages/arrow-right.svg";
import EventsButton from "@/components/EventButton/EventsButton";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as HTMLElement).closest(".mobile-nav")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-20 bg-white/30 backdrop-blur-sm shadow-sm">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Explore CaviteVenture in a more Modern world
        </p>
        <Link href="/signup" className="inline-flex gap-1 items-center group">
          <p>Get Started for Free</p>
          <motion.div
            whileHover={{ x: 5 }}  // Moves 5px to the right on hover
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Image
              src={ArrowRight}
              alt="Arrow right icon"
              height={16}
              width={16}
              className="h-4 w-4 inline-flex justify-center items-center group-hover:translate-x-1 transition-transform duration-300"  // Smooth hover effect
              priority
            />
          </motion.div>
        </Link>
      </div>

      <div className="py-5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src={Logo}
              alt="Saas logo"
              width={40}
              height={40}
              className="rounded-lg"
              priority
            />
          </Link>

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <Image
              src={isMenuOpen ? CloseIcon : MenuIcon}
              alt={isMenuOpen ? "Close menu icon" : "Open menu icon"}
              height={20}
              width={20}
              className="h-5 w-5"
              priority
            />
          </button>

          <nav className="hidden md:flex gap-6 text-black/60 items-center">
            <Link href="/" className="hover:text-black transition-colors duration-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-black transition-colors duration-300">
              About
            </Link>
            <EventsButton />
            <Link href="/signup">
              <button className="bg-black text-white px-4 py-2 rounded-lg font-medium tracking-tight hover:scale-105 transition-transform">
                Explore for Free
              </button>
            </Link>
          </nav>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                className="mobile-nav absolute top-0 right-0 w-2/3 h-screen bg-white/30 backdrop-blur-lg shadow-lg z-30 flex flex-col items-center justify-center gap-8 md:hidden"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                transition={{ duration: 0.3 }}
              >
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <EventsButton />
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform">
                    Explore for Free
                  </button>
                </Link>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
