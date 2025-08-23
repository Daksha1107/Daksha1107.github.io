'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

interface ComposerProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function Composer({ onSendMessage, disabled }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel border-t border-white/10 p-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end space-x-3">
          {/* Attachment button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="glass-button p-3 rounded-xl mb-2 flex-shrink-0"
            disabled={disabled || sending}
          >
            <Paperclip className="w-5 h-5 text-white/70" />
          </motion.button>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={disabled || sending}
              rows={1}
              className="w-full max-h-32 resize-none bg-glass-medium backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all scrollbar-hide"
            />
            
            {/* Character count */}
            {message.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-6 right-0 text-xs text-white/40"
              >
                {message.length}
              </motion.div>
            )}
          </div>

          {/* Send button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim() || disabled || sending}
            className={`p-3 rounded-xl mb-2 flex-shrink-0 transition-all duration-200 ${
              message.trim() && !disabled && !sending
                ? 'bg-accent hover:bg-accent/90 accent-glow'
                : 'bg-glass-medium border border-white/20'
            }`}
          >
            <motion.div
              animate={sending ? { rotate: 360 } : { rotate: 0 }}
              transition={sending ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
            >
              <Send className={`w-5 h-5 ${
                message.trim() && !disabled && !sending ? 'text-white' : 'text-white/50'
              }`} />
            </motion.div>
          </motion.button>
        </div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-white/40 mt-2 text-center"
        >
          Press Enter to send, Shift + Enter for new line
        </motion.p>
      </div>
    </motion.div>
  );
}