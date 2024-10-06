import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import dynamic from 'next/dynamic'; // Dynamic imports for lazy loading
import Head from 'next/head'; // For SEO

// Lazy-load dashboard components to improve performance
const Dashboard11 = dynamic(() => import('@/components/Dashboard/Dashboard1'), { ssr: false });
const Dashboard22 = dynamic(() => import('@/components/Dashboard/Dashboard2'), { ssr: false });
const Dashboard33 = dynamic(() => import('@/components/Dashboard/Dashboard3'), { ssr: false });
const Dashboard00 = dynamic(() => import('@/components/Dashboard/Dashboard'), { ssr: false });

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
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="User dashboard with personalized information." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
        <Navbar />
        <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Dashboard11 />
          <Dashboard00 />
          <Dashboard22 />
          <Dashboard33 />
        </main>
      </div>
    </>
  );
}

// Fetch user on the server side with proper error handling
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authResult = await requireAuth(ctx); // This function fetches and returns the authenticated user
    return authResult;
  } catch (error) {
    console.error('Authentication error:', error); // Log the error
    return {
      redirect: {
        destination: '/login', // Redirect to login page if authentication fails
        permanent: false,
      },
    };
  }
};
