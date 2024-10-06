import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const Dashboard11 = dynamic(() => import('@/components/Dashboard/Dashboard1'), { ssr: false });
const Dashboard22 = dynamic(() => import('@/components/Dashboard/Dashboard2'), { ssr: false });
const Dashboard33 = dynamic(() => import('@/components/Dashboard/Dashboard3'), { ssr: false });
const Dashboard00 = dynamic(() => import('@/components/Dashboard/Dashboard'), { ssr: false });

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface DashboardProps {
  user: User;
}

// Fetch user on the server-side
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authResult = await requireAuth(ctx); // Ensure user is authenticated
    return authResult;
  } catch (error) {
    console.error('Authentication error:', error); // Log errors
    return {
      redirect: {
        destination: '/login', // Redirect to login page if not authenticated
        permanent: false,
      },
    };
  }
};

// Main Dashboard component
export default function Dashboard({ }: DashboardProps) {
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
