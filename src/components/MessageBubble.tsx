'use client';

import { motion } from 'framer-motion';
import { Message } from '@/types';
import { formatTimestamp } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.sender_role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.2, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-gradient-to-br from-accent to-accent/80 ml-3' 
              : 'bg-gradient-to-br from-primary-600 to-primary-700 mr-3'
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </motion.div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${
              isUser 
                ? 'message-user' 
                : 'message-bot'
            } shadow-glass-sm`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </motion.div>
          
          <span className="text-xs text-white/40 mt-2">
            {formatTimestamp(message.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}