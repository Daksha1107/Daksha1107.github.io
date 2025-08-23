'use client';

import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo';
import AuthPage from './auth/page';
import { useAuth } from '@/lib/auth';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Redirect to dashboard if authenticated
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
    </div>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ApolloProvider>
  );
}