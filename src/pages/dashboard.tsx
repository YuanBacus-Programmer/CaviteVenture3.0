import { GetServerSidePropsContext } from 'next';
import { requireAuth } from '../utils/authMiddleware';
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/Layout/Layout';
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
  profilePicture?: string;
}

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <Layout>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="User dashboard with personalized information." />
      </Head>
      <Dashboard11 />
      <Dashboard00 />
      <Dashboard22 />
      <Dashboard33 />
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
