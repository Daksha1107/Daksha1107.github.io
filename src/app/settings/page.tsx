'use client';

import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function SettingsContent() {
  const { isAuthenticated, loading, user, logout } = useAuth();
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
      <div className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
            <p className="text-white/60">Manage your account and preferences</p>
          </div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </h2>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {user?.display_name || 'User'}
                  </h3>
                  <p className="text-white/60">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-white/80">Email</span>
                  </div>
                  <p className="text-white">{user?.email}</p>
                </div>

                <div className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-white/80">Member Since</span>
                  </div>
                  <p className="text-white">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Account Actions</h2>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full glass-button p-4 rounded-xl flex items-center justify-between hover:bg-red-500/10 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="font-medium text-white group-hover:text-red-400 transition-colors">
                    Sign Out
                  </span>
                </div>
                <span className="text-white/40 text-sm">
                  Sign out of your account
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* App Information */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">About</h2>
            
            <div className="space-y-4 text-white/60">
              <div className="flex justify-between">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Framework</span>
                <span>Next.js 14</span>
              </div>
              <div className="flex justify-between">
                <span>GraphQL Client</span>
                <span>Apollo Client</span>
              </div>
              <div className="flex justify-between">
                <span>UI Framework</span>
                <span>Tailwind CSS</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <SettingsContent />
      </AuthProvider>
    </ApolloProvider>
  );
}