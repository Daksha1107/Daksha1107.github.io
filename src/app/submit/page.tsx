'use client';

import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { FileText, Download, Code, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function SubmitContent() {
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

  const assignmentTemplate = `# Chatbot Assessment App - Assignment Submission

## Project Overview
Frontend implementation of a Chatbot Assessment App using Next.js 14 with TypeScript and GraphQL.

## Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom cinematic theme
- **GraphQL Client**: Apollo Client with HTTP & WebSocket support
- **Animations**: Framer Motion
- **Authentication**: JWT-based auth system
- **Real-time**: GraphQL subscriptions for live messaging

## Key Features Implemented
✅ Authentication system with login/register
✅ Real-time chat interface with GraphQL subscriptions
✅ Premium cinematic UI design with Netflix-inspired colors
✅ Message composer with auto-resize and keyboard shortcuts
✅ Responsive sidebar with chat history
✅ Status indicators for connection and message states
✅ Glass morphism design with smooth animations
✅ TypeScript types and interfaces
✅ Production-ready build configuration

## GraphQL Operations
All specified GraphQL operations implemented:
- GetChatsForUser
- GetMessagesForChat
- OnMessages (subscription)
- InsertUserMessage
- SendMessageAction

## Architecture Highlights
- Component-based architecture with reusable UI components
- Context-based state management for authentication
- Apollo Client configuration with error handling
- Real-time subscriptions for live message updates
- Optimistic UI updates for better user experience
- Glass panel design system with consistent styling

## Deployment Ready
- Static export configuration for GitHub Pages
- Environment variable configuration
- Production build optimization
- Accessible focus states and keyboard navigation

## Demo
The application demonstrates a complete chatbot interface with:
- Secure authentication flow
- Real-time messaging capabilities
- Premium user experience
- Responsive design for all screen sizes

---
Submitted by: [Your Name]
Date: ${new Date().toLocaleDateString()}
Repository: https://github.com/Daksha1107/Daksha1107.github.io`;

  const handleDownload = () => {
    const blob = new Blob([assignmentTemplate], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-assessment-submission.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            <h1 className="text-3xl font-bold text-gradient mb-2">Submission</h1>
            <p className="text-white/60">Assignment completion summary and download</p>
          </div>

          {/* Completion Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Assignment Completed</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-medium text-white mb-1">Frontend Complete</h3>
                <p className="text-white/60 text-sm">Next.js 14 app with TypeScript</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Code className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-medium text-white mb-1">GraphQL Integration</h3>
                <p className="text-white/60 text-sm">Apollo Client with subscriptions</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-medium text-white mb-1">Premium UI</h3>
                <p className="text-white/60 text-sm">Cinematic design with Framer Motion</p>
              </div>
            </div>
          </motion.div>

          {/* Assignment Template */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-3">
              <FileText className="w-5 h-5" />
              <span>Assignment Template</span>
            </h2>

            <div className="bg-charcoal-950 rounded-xl p-6 mb-6 font-mono text-sm overflow-x-auto">
              <pre className="text-white/80 whitespace-pre-wrap">
                {assignmentTemplate}
              </pre>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 px-6 rounded-xl transition-all accent-glow flex items-center justify-center space-x-3"
            >
              <Download className="w-5 h-5" />
              <span>Download Submission Template</span>
            </motion.button>
          </motion.div>

          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Implementation Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-xl">
                  <h3 className="font-medium text-accent mb-2">Core Features</h3>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• JWT Authentication</li>
                    <li>• Real-time messaging</li>
                    <li>• GraphQL subscriptions</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>

                <div className="glass-panel p-4 rounded-xl">
                  <h3 className="font-medium text-accent mb-2">UI/UX</h3>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• Glass morphism design</li>
                    <li>• Smooth animations</li>
                    <li>• Cinematic color palette</li>
                    <li>• Premium interactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Submit() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <SubmitContent />
      </AuthProvider>
    </ApolloProvider>
  );
}