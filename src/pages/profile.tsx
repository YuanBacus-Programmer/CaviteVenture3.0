import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import Profile1 from '@/components/Profile/Profile';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ProfileProps {
  user: User;
}

// Fetch user on the server-side
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return requireAuth(ctx); // Ensure user is authenticated
};

// Main Profile component
export default function Profile({ }: ProfileProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
      {/* Navbar no longer requires 'user' prop */}
      <Navbar />
      <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Profile1 />
        </div>
      </main>
    </div>
  );
}
