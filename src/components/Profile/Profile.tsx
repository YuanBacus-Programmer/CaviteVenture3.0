'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import { Toast } from '@/components/Toast/Toast';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export
import { DecodedToken, IUser, ToastState } from '@/types'; // Corrected imports

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<IUser>({
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    profilePicture: '/placeholder-user.jpg',
    isVerified: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        router.push('/signin');
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.userId) {
        console.error('Invalid token: userId not found');
        router.push('/signin');
        return;
      }

      const response = await fetch(`/api/user/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
      } else {
        throw new Error(data.message || 'Error fetching user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/signin');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      if (!token) {
        setToast({ show: true, message: 'Authentication error. Please log in again.', type: 'error' });
        return;
      }

      setIsUploading(true);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();

        if (data.imageUrl) {
          setUser((prevUser: IUser) => ({ ...prevUser, profilePicture: data.imageUrl }));

          await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ profilePicture: data.imageUrl }),
          });

          setToast({ show: true, message: 'Profile picture updated successfully!', type: 'success' });
        } else {
          throw new Error('Image URL not received');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        setToast({ show: true, message: 'Failed to upload image.', type: 'error' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setToast({ show: true, message: 'Authentication error. Please log in again.', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ show: true, message: 'Failed to update profile.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser({ firstName: '', lastName: '', email: '', role: '', profilePicture: '/placeholder-user.jpg', _id: '', isVerified: false });
    setToast({ show: true, message: 'Logged out successfully!', type: 'success' });

    setTimeout(() => {
      router.push('/signin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
      <Navbar />
      <AnimatePresence>
        {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      </AnimatePresence>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 max-w-4xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-r from-[#fae8b4] to-[#f5d78e]">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                <Image
                  src={user.profilePicture || '/placeholder-user.jpg'}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-[#fae8b4] p-2 rounded-full cursor-pointer shadow-md hover:bg-[#f5d78e] transition-colors duration-200"
                >
                  <FiUpload className="text-gray-800" />
                  <input
                    type="file"
                    id="profile-picture"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="pt-16 px-8 pb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center text-gray-900 mb-6"
            >
              Your Profile
            </motion.h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    disabled={!isEditing || isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fae8b4] focus:ring-[#fae8b4] transition-all duration-200"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    disabled={!isEditing || isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fae8b4] focus:ring-[#fae8b4] transition-all duration-200"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    disabled={!isEditing || isLoading}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#fae8b4] focus:ring-[#fae8b4] transition-all duration-200"
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={user.role}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-6 flex items-center justify-between space-x-4"
              >
                {isEditing ? (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="bg-[#fae8b4] text-gray-800 px-4 py-2 rounded-md hover:bg-[#f5d78e] transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-[#fae8b4] text-gray-800 px-4 py-2 rounded-md hover:bg-[#f5d78e] transition-colors duration-200"
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                    >
                      Logout
                    </motion.button>
                  </>
                )}
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
