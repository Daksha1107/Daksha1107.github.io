'use client';

import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="glass border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-semibold text-foreground">Chatbot Assessment</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-foreground-muted">
              <UserIcon className="w-5 h-5" />
              <span className="text-sm">{user?.displayName || user?.email}</span>
            </div>

            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Cog6ToothIcon className="w-5 h-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}