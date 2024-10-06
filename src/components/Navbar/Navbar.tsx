"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiImage, FiCalendar, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { useUser } from '@/context/UserContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Role-based redirection for protected routes
  useEffect(() => {
    if (pathname === '/admin' && user?.role !== 'admin') {
      router.push('/dashboard');
    } else if (pathname === '/superadmin' && user?.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [pathname, user?.role, router]);

  if (!user) return null;

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/exhibit', label: 'Exhibit', icon: FiImage },
    { href: '/events', label: 'Events', icon: FiCalendar },
  ];

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-[#fff8e1] rounded-full backdrop-blur-sm bg-opacity-80 overflow-visible px-4 py-2 w-auto max-w-3xl">
        <motion.div
          className="absolute inset-0 bg-[#fae8b4] opacity-30 rounded-full"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <div className="relative z-20">
          <div className="flex justify-between items-center h-12">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800">
              CaviteVenture
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <motion.div
                    className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      pathname === link.href
                        ? 'bg-[#f5d78e] text-gray-900'
                        : 'text-gray-700 hover:bg-[#f5d78e] hover:text-gray-900'
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.5)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className="mr-2" />
                    {link.label}
                  </motion.div>
                </Link>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                className="text-gray-800 hover:text-gray-600 focus:outline-none"
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.button>
            </div>
            
            {/* User Dropdown */}
            <div className="relative hidden md:block">
              <motion.button
                className="flex items-center text-gray-800 hover:text-gray-600 focus:outline-none bg-[#f5d78e] bg-opacity-50 rounded-full px-3 py-2"
                onClick={toggleDropdown}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.5)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={user.profilePicture || '/placeholder.svg?height=24&width=24'}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
                <span className="hidden sm:inline">{user.firstName}</span>
                <FiChevronDown className="ml-2" />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                  >
                    <Link href="/profile" passHref>
                      <motion.div 
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                        whileHover={{ backgroundColor: '#f5d78e' }}
                      >
                        Profile
                      </motion.div>
                    </Link>
                    {/* Show Admin Panel only for users with the 'admin' role */}
                    {user.role === 'admin' && (
                      <Link href="/admin" passHref>
                        <motion.div 
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                          whileHover={{ backgroundColor: '#f5d78e' }}
                        >
                          Admin Panel
                        </motion.div>
                      </Link>
                    )}
                    {/* Show Superadmin Panel only for users with the 'superadmin' role */}
                    {user.role === 'superadmin' && (
                      <Link href="/superadmin" passHref>
                        <motion.div 
                          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                          whileHover={{ backgroundColor: '#f5d78e' }}
                        >
                          Superadmin Panel
                        </motion.div>
                      </Link>
                    )}
                    {!user.role && (
                      <div className="block px-4 py-2 text-sm text-red-600">
                        Role not defined. Contact support.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white rounded-b-lg shadow-lg overflow-hidden mt-2"
              >
                {links.map((link) => (
                  <Link key={link.href} href={link.href} passHref>
                    <motion.div
                      className={`flex items-center px-4 py-3 ${
                        pathname === link.href
                          ? 'bg-[#f5d78e] text-gray-900'
                          : 'text-gray-700 hover:bg-[#f5d78e] hover:text-gray-900'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ 
                        backgroundColor: '#f5d78e',
                        boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.5)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <link.icon className="mr-2" />
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
                <Link href="/profile" passHref>
                  <motion.div
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f5d78e] hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ 
                      backgroundColor: '#f5d78e',
                      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.5)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Profile
                  </motion.div>
                </Link>
                {/* Show Admin Panel only for users with the 'admin' role */}
                {user.role === 'admin' && (
                  <Link href="/admin" passHref>
                    <motion.div
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f5d78e] hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ 
                        backgroundColor: '#f5d78e',
                        boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.5)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Admin Panel
                    </motion.div>
                  </Link>
                )}
                {/* Show Superadmin Panel only for users with the 'superadmin' role */}
                {user.role === 'superadmin' && (
                  <Link href="/superadmin" passHref>
                    <motion.div
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#f5d78e] hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ 
                        backgroundColor: '#f5d78e',
                        boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.5)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Superadmin Panel
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
}
