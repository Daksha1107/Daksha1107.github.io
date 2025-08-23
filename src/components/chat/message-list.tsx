'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { MessageBubble } from './message-bubble';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="space-y-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.sender_role === 'user'}
          />
        ))}
        
        {isLoading && (
          <div className="flex gap-3 max-w-4xl mr-auto">
            {/* Bot Avatar */}
            <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-foreground-muted rounded-full animate-pulse"></div>
            </div>
            
            {/* Typing Indicator */}
            <div className="bg-surface-elevated text-foreground rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}