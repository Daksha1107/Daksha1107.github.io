'use client';

import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardContent() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-2 border-accent/30 border-t-accent rounded-full"
                />
              </div>
              
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Welcome to ChatBot Assessment
              </h1>
              
              <p className="text-white/60 text-lg mb-8">
                Start a new conversation or continue an existing chat from the sidebar.
                Experience premium AI-powered conversations with real-time responses.
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-panel p-6 rounded-2xl text-left"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Getting Started
                </h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Click "New Chat" to start a conversation</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Browse your chat history in the sidebar</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Enjoy real-time responses and premium design</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </ApolloProvider>
  );
}