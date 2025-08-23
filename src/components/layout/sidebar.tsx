'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CHATS_FOR_USER } from '@/graphql/operations';
import { GetChatsForUserData, GetChatsForUserVariables, Chat } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, ChatBubbleLeftIcon, DocumentTextIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon as ChatBubbleLeftSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function Sidebar() {
  const pathname = usePathname();
  const [isCreating, setIsCreating] = useState(false);

  const { data, loading, error } = useQuery<GetChatsForUserData, GetChatsForUserVariables>(
    GET_CHATS_FOR_USER,
    {
      variables: { limit: 50 },
      errorPolicy: 'all',
    }
  );

  const handleCreateChat = async () => {
    setIsCreating(true);
    // TODO: Implement create chat mutation
    setTimeout(() => setIsCreating(false), 1000);
  };

  const formatChatTitle = (chat: Chat) => {
    return chat.title || `Chat ${chat.id.slice(0, 8)}...`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: ChatBubbleLeftIcon,
      activeIcon: ChatBubbleLeftSolid,
    },
    {
      name: 'Submit',
      href: '/submit',
      icon: DocumentTextIcon,
      activeIcon: DocumentTextIcon,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothIcon,
    },
  ];

  return (
    <aside className="w-80 bg-surface border-r border-border-subtle flex flex-col h-full">
      {/* Navigation */}
      <div className="p-4 border-b border-border-subtle">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive ? item.activeIcon : item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Chat List */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border-subtle">
          <Button
            onClick={handleCreateChat}
            disabled={isCreating}
            className="w-full"
            variant="primary"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <PlusIcon className="w-5 h-5" />
                <span>New Chat</span>
              </div>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-surface-elevated rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-foreground-muted">
              <p>Failed to load chats</p>
              <p className="text-sm">{error.message}</p>
            </div>
          ) : !data?.chats?.length ? (
            <div className="p-4 text-center text-foreground-muted">
              <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No chats yet</p>
              <p className="text-sm">Create your first chat to get started</p>
            </div>
          ) : (
            <div className="p-2">
              {data.chats.map((chat) => {
                const isActive = pathname === `/chats/${chat.id}`;
                
                return (
                  <Link key={chat.id} href={`/chats/${chat.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        'p-3 rounded-lg mb-2 transition-all duration-200 cursor-pointer',
                        isActive
                          ? 'bg-accent/10 border border-accent text-foreground'
                          : 'hover:bg-surface-elevated text-foreground-muted hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{formatChatTitle(chat)}</h3>
                          <p className="text-sm text-foreground-subtle">
                            {formatDate(chat.updated_at)}
                          </p>
                        </div>
                        <ChatBubbleLeftIcon className="w-4 h-4 ml-2 flex-shrink-0" />
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}