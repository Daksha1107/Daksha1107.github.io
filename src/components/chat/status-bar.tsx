'use client';

import { StatusBarProps } from '@/types';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export function StatusBar({ status, error }: StatusBarProps) {
  if (status === 'idle') return null;

  const statusConfig = {
    sending: {
      icon: ClockIcon,
      text: 'Sending message...',
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    waiting: {
      icon: ClockIcon,
      text: 'Waiting for AI response...',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    error: {
      icon: ExclamationTriangleIcon,
      text: error || 'Something went wrong',
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx(
        'px-4 py-2 border-b border-border-subtle',
        config.bgColor
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        {status === 'sending' || status === 'waiting' ? (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span className={clsx('text-sm font-medium', config.color)}>
          {config.text}
        </span>
      </div>
    </motion.div>
  );
}