import { useState, useEffect, useCallback } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiCalendar, FiUsers, FiShield } from 'react-icons/fi'
import { requireRole } from '@/utils/authMiddleware'
import Navbar from '@/components/Navbar/Navbar'
import EventManagement from '@/components/Superadmin/EventManagement/EventManagement'
import UserManagement from '@/components/Superadmin/UserManagement/UserManagement'
import AdminManagement from '@/components/Superadmin/AdminManagement/AdminManagement'

interface User {
  firstName: string
  lastName: string
  email: string
  role: string
}

interface SuperAdminPageProps {
  user: User
}

enum Page {
  EventManagement,
  UserManagement,
  AdminManagement,
}

const pageConfig = [
  { page: Page.EventManagement, title: 'Event Management', icon: FiCalendar },
  { page: Page.UserManagement, title: 'User Management', icon: FiUsers },
  { page: Page.AdminManagement, title: 'Admin Management', icon: FiShield },
]

export default function SuperAdminPage({}: SuperAdminPageProps) {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.EventManagement)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  // Handle page change
  const handlePageChange = (page: Page) => {
    setSelectedPage(page)
    setIsSidebarOpen(false)
  }

  // Debounced window resize handler
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const debounceResize = () => {
      let timeoutId: ReturnType<typeof setTimeout>
      return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(handleResize, 200) // Debouncing resize for performance
      }
    }

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      const debouncedHandleResize = debounceResize()
      window.addEventListener('resize', debouncedHandleResize)

      return () => window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [handleResize])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Mobile Sidebar Toggle */}
            <motion.button
              className="lg:hidden mb-4 p-2 bg-white rounded-md shadow-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>

            {/* Sidebar */}
            <AnimatePresence>
              {(isSidebarOpen || (windowWidth !== null && windowWidth >= 1024)) && (
                <motion.div
                  className="lg:w-64 bg-white shadow-md rounded-lg p-4"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <ul className="space-y-4">
                    {pageConfig.map(({ page, title, icon: Icon }) => (
                      <li key={page}>
                        <motion.button
                          onClick={() => handlePageChange(page)}
                          className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 ${
                            selectedPage === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{title}</span>
                        </motion.button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <motion.div
              className="flex-grow bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedPage === Page.EventManagement && <EventManagement />}
                  {selectedPage === Page.UserManagement && <UserManagement />}
                  {selectedPage === Page.AdminManagement && <AdminManagement />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Secure server-side rendering with role-based access
export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return requireRole(ctx, 'superadmin')
}
