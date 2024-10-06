// pages/superadmin.tsx
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { requireRole } from '@/utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import EventManagement from '@/components/Superadmin/EventManagement/EventManagement';
import UserManagement from '@/components/Superadmin/UserManagement/UserManagement';
import AdminManagement from '@/components/Superadmin/AdminManagement/AdminManagement';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface SuperAdminPageProps {
  user: User;
}

// Enum for managing the selected page in the sidebar
enum Page {
  EventManagement,
  UserManagement,
  AdminManagement
}

export default function SuperAdminPage({ }: SuperAdminPageProps) {
  const [selectedPage, setSelectedPage] = useState<Page>(Page.EventManagement);

  // Handler to update the selected page
  const handlePageChange = (page: Page) => {
    setSelectedPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
      <Navbar />
      <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        <div className="mt-8 grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 bg-white shadow-md rounded-lg p-4">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handlePageChange(Page.EventManagement)}
                  className={`w-full text-left p-2 rounded-lg ${
                    selectedPage === Page.EventManagement ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  Event Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange(Page.UserManagement)}
                  className={`w-full text-left p-2 rounded-lg ${
                    selectedPage === Page.UserManagement ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  User Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange(Page.AdminManagement)}
                  className={`w-full text-left p-2 rounded-lg ${
                    selectedPage === Page.AdminManagement ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  Admin Management
                </button>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="col-span-3 bg-white shadow-md rounded-lg p-6">
            {selectedPage === Page.EventManagement && <EventManagement />}
            {selectedPage === Page.UserManagement && <UserManagement />}
            {selectedPage === Page.AdminManagement && <AdminManagement />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Ensure only users with the 'superadmin' role can access this page
export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return requireRole(ctx, 'superadmin'); // Restrict access to 'superadmin' role
};
