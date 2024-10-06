import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import PostEvent from '@/components/Superadmin/EventManagement/PostEvent';
import Layout from '@/components/Layout/Layout';
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

export default function Events({ user }: EventsProps) {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <Layout>
      <Head>
        <title>Event Management | Superadmin</title>
        <meta name="description" content="Manage and post events as a superadmin." />
      </Head>
      <PostEvent />
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
