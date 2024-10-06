import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8e1] to-white">
      <Navbar />
      <main className="pt-24 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
