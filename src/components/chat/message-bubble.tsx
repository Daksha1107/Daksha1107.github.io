'use client';

import { motion } from 'framer-motion';
import { MessageBubbleProps } from '@/types';
import { UserIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'flex gap-3 max-w-4xl',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div className={clsx(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
        isUser 
          ? 'bg-accent text-white' 
          : 'bg-surface-elevated text-foreground-muted'
      )}>
        {isUser ? (
          <UserIcon className="w-4 h-4" />
        ) : (
          <CpuChipIcon className="w-4 h-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={clsx(
        'flex flex-col gap-1',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={clsx(
          'max-w-2xl px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-accent text-white rounded-br-md'
            : 'bg-surface-elevated text-foreground rounded-bl-md'
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <span className="text-xs text-foreground-subtle px-2">
          {formatTime(message.created_at)}
        </span>
      </div>
    </motion.div>
  );
}