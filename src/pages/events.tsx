import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import { useUser } from '@/context/UserContext'; // Import the UserContext hook
import { useEffect } from 'react';
import PostEvent from '@/components/Superadmin/EventManagement/PostEvent';
import Head from 'next/head'; // Import for SEO

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface EventsProps {
  user: User;
}

export default function Events({ user }: EventsProps) {
  const { setUser } = useUser(); // Use UserContext to set the user globally

  // Set the user in the context when the page loads
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <>
      <Head>
        <title>Event Management | Superadmin</title> {/* SEO improvements */}
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

// Ensure only authenticated users can access this page
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authResult = await requireAuth(ctx); // Secure authentication
    return authResult; // Pass the authenticated user to the page
  } catch (error) {
    console.error('Authentication error:', error); // Log the error in production for better debugging
    return {
      redirect: {
        destination: '/login', // Redirect to login page if auth fails
        permanent: false,
      },
    };
  }
};
