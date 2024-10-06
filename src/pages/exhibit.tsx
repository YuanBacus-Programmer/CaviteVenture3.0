import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import Navbar from '@/components/Navbar/Navbar';
import Exhibit1 from '@/components/Exhibit/Exhibit';
import Head from 'next/head';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ExhibitProps {
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

// Main Exhibit component
export default function Exhibit({ }: ExhibitProps) {
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
