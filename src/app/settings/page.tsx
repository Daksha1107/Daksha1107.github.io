'use client';

import { useAuth } from '@/lib/auth';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-foreground-muted mt-1">
              Manage your account and preferences
            </p>
          </div>

          {/* Profile Section */}
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Profile</h2>
                <p className="text-foreground-muted">Your account information</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Display Name"
                value={user?.displayName || ''}
                placeholder="Enter your display name"
                disabled
              />
              <Input
                label="Email Address"
                type="email"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="mt-6 pt-6 border-t border-border-subtle">
              <p className="text-sm text-foreground-muted">
                Profile editing is currently disabled in demo mode.
              </p>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="glass rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Theme</h3>
                  <p className="text-sm text-foreground-muted">Choose your preferred theme</p>
                </div>
                <select 
                  className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
                  defaultValue="dark"
                  disabled
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Notifications</h3>
                  <p className="text-sm text-foreground-muted">Receive notifications for new messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked disabled />
                  <div className="w-11 h-6 bg-surface-elevated peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border-subtle">
              <p className="text-sm text-foreground-muted">
                Preference changes are currently disabled in demo mode.
              </p>
            </div>
          </div>

          {/* Account Actions Section */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Account Actions</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Sign Out</h3>
                  <p className="text-sm text-foreground-muted">Sign out of your account</p>
                </div>
                <Button variant="danger" onClick={handleLogout}>
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="mt-8 text-center text-sm text-foreground-subtle">
            <p>Chatbot Assessment v1.0.0</p>
            <p>Built with Next.js 14 and GraphQL</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}