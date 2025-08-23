'use client';

import { useQuery } from '@apollo/client/react';
import { GET_CHATS_FOR_USER } from '@/graphql/operations';
import { GetChatsForUserData, GetChatsForUserVariables, Chat } from '@/types';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { ChatBubbleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data, loading, error } = useQuery<GetChatsForUserData, GetChatsForUserVariables>(
    GET_CHATS_FOR_USER,
    {
      variables: { limit: 20 },
      errorPolicy: 'all',
    }
  );

  const formatChatTitle = (chat: Chat) => {
    return chat.title || `Chat ${chat.id.slice(0, 8)}...`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-foreground-muted mt-1">
                Manage your AI conversations and assessments
              </p>
            </div>
            <Button variant="primary">
              <PlusIcon className="w-5 h-5 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="glass rounded-xl p-6 h-32">
                    <div className="h-4 bg-surface-elevated rounded mb-4"></div>
                    <div className="h-3 bg-surface-elevated rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-surface-elevated rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-error mb-4">
                <ChatBubbleLeftIcon className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Failed to load chats</h3>
              <p className="text-foreground-muted">{error.message}</p>
            </div>
          ) : !data?.chats?.length ? (
            <div className="text-center py-12">
              <div className="text-foreground-muted mb-6">
                <ChatBubbleLeftIcon className="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No chats yet</h3>
              <p className="text-foreground-muted mb-6">
                Create your first chat to start a conversation with our AI
              </p>
              <Button variant="primary">
                <PlusIcon className="w-5 h-5 mr-2" />
                Start Your First Chat
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Recent Chats</h2>
                <p className="text-foreground-muted">Your latest AI conversations</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.chats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={`/chats/${chat.id}`}>
                      <div className="glass rounded-xl p-6 hover:bg-surface-elevated transition-all duration-200 cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <ChatBubbleLeftIcon className="w-5 h-5 text-accent" />
                          </div>
                          <span className="text-xs text-foreground-subtle">
                            {formatDate(chat.updated_at)}
                          </span>
                        </div>
                        
                        <h3 className="font-medium text-foreground mb-2 truncate">
                          {formatChatTitle(chat)}
                        </h3>
                        
                        <p className="text-sm text-foreground-muted">
                          Last updated: {new Date(chat.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}