'use client';

import { motion } from 'framer-motion';
import { User, Settings, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel border-b border-white/10 p-4"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gradient">
            ChatBot Assessment
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">
                {user?.display_name || user?.email}
              </div>
              <div className="text-white/60 text-xs">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link 
              href="/settings"
              className="glass-button p-2 rounded-lg hover:accent-glow transition-all"
            >
              <Settings className="w-4 h-4 text-white/80" />
            </Link>
            
            <button
              onClick={logout}
              className="glass-button p-2 rounded-lg hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}