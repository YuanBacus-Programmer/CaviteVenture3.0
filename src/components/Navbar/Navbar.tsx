import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHome, FiImage, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { useUser } from '@/context/UserContext'; // Import UserContext

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser(); // Get the user from UserContext
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null; // Don't render Navbar if user data isn't loaded yet

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/exhibit', label: 'Exhibit', icon: FiImage },
    { href: '/events', label: 'Events', icon: FiCalendar },
  ];

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-5xl">
      <nav className="bg-[#fff8e1] rounded-full backdrop-blur-sm bg-opacity-80 overflow-visible">
        <motion.div
          className="absolute inset-0 bg-[#fae8b4] opacity-30"
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
        <div className="px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800">
              CaviteVenture
            </Link>
            <div className="flex-grow flex justify-center items-center space-x-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} passHref>
                  <motion.div
                    className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                      pathname === link.href
                        ? 'bg-[#f5d78e] text-gray-900'
                        : 'text-gray-700 hover:bg-[#f5d78e] hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <link.icon className="mr-2" />
                    {link.label}
                  </motion.div>
                </Link>
              ))}
            </div>
            <div className="relative">
              <motion.button
                className="flex items-center text-gray-800 hover:text-gray-600 focus:outline-none bg-[#f5d78e] bg-opacity-50 rounded-full px-3 py-2"
                onClick={toggleDropdown}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={user.profilePicture || '/placeholder-user.jpg'}
                  alt="Profile"
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
                <span className="hidden sm:inline">{user.firstName}</span>
                <FiChevronDown className="ml-2" />
              </motion.button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50"
                >
                  <Link href="/profile" passHref>
                    <div className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Profile
                    </div>
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" passHref>
                      <div className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                        Admin Panel
                      </div>
                    </Link>
                  )}
                  {user.role === 'superadmin' && (
                    <Link href="/superadmin" passHref>
                      <div className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer">
                        Superadmin Panel
                      </div>
                    </Link>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
