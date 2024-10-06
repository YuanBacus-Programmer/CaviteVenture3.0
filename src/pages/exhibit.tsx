import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import Exhibit1 from '@/components/Exhibit/Exhibit';
import Head from 'next/head'; // For SEO and metadata

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ExhibitProps {
  user: User;
}

export default function Exhibit({ user }: ExhibitProps) {
  const { setUser } = useUser(); // Use UserContext to set the user globally

  // Set the user in the context when the page loads
  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <>
      <Head>
        <title>Exhibit | Exhibit1</title>
        <meta name="description" content="Exhibit1 details and management page." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
        <Navbar />
        <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Exhibit1 />
        </main>
      </div>
    </>
  );
}

// Ensure only authenticated users can access this page
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authResult = await requireAuth(ctx); // Securely authenticate the user
    return authResult;
  } catch (error) {
    console.error('Authentication error:', error); // Log authentication errors
    return {
      redirect: {
        destination: '/login', // Redirect to login if authentication fails
        permanent: false,
      },
    };
  }
};
