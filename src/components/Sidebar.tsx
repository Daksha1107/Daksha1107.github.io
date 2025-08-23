'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { Plus, MessageSquare } from 'lucide-react';
import { GET_CHATS_FOR_USER } from '@/graphql/queries';
import { Chat } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const router = useRouter();
  const { data, loading } = useQuery(GET_CHATS_FOR_USER, {
    variables: { limit: 50, offset: 0 },
    errorPolicy: 'all'
  });

  const chats: Chat[] = data?.chats || [];

  const handleNewChat = () => {
    // For now, navigate to a mock chat
    const mockChatId = 'new-chat-' + Date.now();
    router.push(`/chats/${mockChatId}`);
  };

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 glass-panel border-r border-white/10 flex flex-col h-full"
    >
      <div className="p-4 border-b border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full glass-button p-3 rounded-xl flex items-center justify-center space-x-3 accent-glow"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Chat</span>
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-panel p-3 rounded-lg animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/chats/${chat.id}`}
                  className="block glass-panel p-3 rounded-lg hover:bg-glass-medium transition-all group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate group-hover:text-accent transition-colors">
                        {chat.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-1">
                        {formatTimestamp(chat.updated_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {chats.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-sm">No chats yet</p>
                <p className="text-white/40 text-xs mt-1">
                  Start a new conversation
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}