import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import { useUser } from '@/context/UserContext'; // Use UserContext to set user globally
import { useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Dashboard11 from '@/components/Dashboard/Dashboard1';
import Dashboard22 from '@/components/Dashboard/Dashboard2';
import Dashboard33 from '@/components/Dashboard/Dashboard3';
import Dashboard00 from '@/components/Dashboard/Dashboard'

// Define the user interface
interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const { setUser } = useUser();

  // Set the user in the context
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
      <Navbar />
      <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard, {user.firstName}</h1>
        <Dashboard11/>
        <Dashboard00/>
        <Dashboard22/>
        <Dashboard33/>
      </main>
    </div>
  );
}

// Fetch user on the server side
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return requireAuth(ctx); // This function fetches and returns the user
};
