'use client';

import { useState, useRef, useEffect } from 'react';
import { ComposerProps } from '@/types';
import { Button } from '@/components/ui/button';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

export function Composer({ onSendMessage, isLoading, disabled }: ComposerProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t border-border-subtle bg-surface p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-4 flex items-end gap-3">
          {/* Message Input */}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                disabled 
                  ? "Please wait..." 
                  : "Type your message... (Press Enter to send, Shift+Enter for new line)"
              }
              className={clsx(
                'w-full bg-transparent text-foreground placeholder:text-foreground-subtle',
                'resize-none border-0 focus:outline-none min-h-[24px] max-h-[120px]',
                'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
              )}
              rows={1}
              disabled={disabled}
            />
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!canSend}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
            ) : (
              <PaperAirplaneIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Status */}
        {(isLoading || disabled) && (
          <div className="flex items-center justify-center mt-2">
            <span className="text-xs text-foreground-subtle">
              {isLoading ? 'Sending message...' : 'Chat is currently unavailable'}
            </span>
          </div>
        )}
      </form>
    </div>
  );
}