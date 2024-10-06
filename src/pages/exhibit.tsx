import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import Exhibit1 from '@/components/Exhibit/Exhibit';
import Layout from '@/components/Layout/Layout';
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

export default function Exhibit({ user }: ExhibitProps) {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <Layout>
      <Head>
        <title>Exhibit | Exhibit1</title>
        <meta name="description" content="Exhibit1 details and management page." />
      </Head>
      <Exhibit1 />
    </Layout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const authResult = await requireAuth(ctx);
    return authResult;
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
