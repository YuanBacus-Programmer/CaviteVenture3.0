import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import PostEvent from '@/components/Superadmin/EventManagement/PostEvent';
import Head from 'next/head';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface EventsProps {
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

// Main Events component
export default function Events({ }: EventsProps) {
  return (
    <>
      <Head>
        <title>Event Management | Superadmin</title>
        <meta name="description" content="Manage and post events as a superadmin." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
        <Navbar />
        <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <PostEvent />
        </main>
      </div>
    </>
  );
}
