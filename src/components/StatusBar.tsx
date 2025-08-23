'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react';

interface StatusBarProps {
  status: 'idle' | 'sending' | 'success' | 'error' | 'offline';
  message?: string;
}

export function StatusBar({ status, message }: StatusBarProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'sending':
        return {
          icon: Loader2,
          text: 'Sending message...',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          iconClass: 'animate-spin'
        };
      case 'success':
        return {
          icon: CheckCircle,
          text: 'Message sent',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          iconClass: ''
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: message || 'Failed to send message',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          iconClass: ''
        };
      case 'offline':
        return {
          icon: WifiOff,
          text: 'Connection lost',
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          iconClass: ''
        };
      default:
        return {
          icon: Wifi,
          text: 'Connected',
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          iconClass: ''
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (status === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`glass-panel ${config.bgColor} border border-white/10 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-glass`}
        >
          <Icon className={`w-4 h-4 ${config.color} ${config.iconClass}`} />
          <span className={`text-sm ${config.color} font-medium`}>
            {config.text}
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}