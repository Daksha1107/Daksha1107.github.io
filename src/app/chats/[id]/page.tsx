'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApolloProvider, useQuery, useMutation, useSubscription } from '@apollo/client';
import { AuthProvider, useAuth } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { Composer } from '@/components/Composer';
import { StatusBar } from '@/components/StatusBar';
import { GET_MESSAGES_FOR_CHAT, ON_MESSAGES, INSERT_USER_MESSAGE, SEND_MESSAGE_ACTION } from '@/graphql/queries';
import { Message } from '@/types';
import { generateUUID } from '@/lib/utils';

function ChatContent() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'offline'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Query for initial messages
  const { data: messagesData, loading: messagesLoading } = useQuery(GET_MESSAGES_FOR_CHAT, {
    variables: { chat_id: chatId },
    skip: !chatId || chatId.startsWith('new-chat'),
    errorPolicy: 'all'
  });

  // Subscription for real-time messages
  const { data: subscriptionData } = useSubscription(ON_MESSAGES, {
    variables: { chat_id: chatId },
    skip: !chatId || chatId.startsWith('new-chat'),
    errorPolicy: 'all'
  });

  // Mutations
  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION);

  // Local state for new chats
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const isNewChat = chatId?.startsWith('new-chat');

  // Use subscription data if available, otherwise query data, otherwise local messages
  const messages: Message[] = subscriptionData?.messages || messagesData?.messages || localMessages;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    setStatus('sending');

    try {
      const userMessage: Message = {
        id: generateUUID(),
        chat_id: chatId,
        sender_role: 'user',
        sender_id: user.id,
        content: text,
        created_at: new Date().toISOString(),
      };

      if (isNewChat) {
        // For new chats, add to local state
        setLocalMessages(prev => [...prev, userMessage]);
      } else {
        // Insert user message to database
        await insertUserMessage({
          variables: {
            obj: {
              chat_id: chatId,
              sender_role: 'user',
              sender_id: user.id,
              content: text,
            }
          }
        });
      }

      // Trigger bot response via Hasura Action
      const actionResult = await sendMessageAction({
        variables: {
          chat_id: chatId,
          text: text
        }
      });

      if (actionResult.data?.sendMessage?.success) {
        setStatus('success');
        setStatusMessage('Message sent successfully');
        
        // For new chats, simulate bot response
        if (isNewChat && actionResult.data.sendMessage.bot_response) {
          setTimeout(() => {
            const botMessage: Message = {
              id: generateUUID(),
              chat_id: chatId,
              sender_role: 'assistant',
              content: actionResult.data.sendMessage.bot_response,
              created_at: new Date().toISOString(),
            };
            setLocalMessages(prev => [...prev, botMessage]);
          }, 1000);
        }
      } else {
        throw new Error(actionResult.data?.sendMessage?.error || 'Failed to send message');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to send message');
    }

    // Reset status after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <MessageList 
            messages={messages} 
            loading={messagesLoading && !isNewChat} 
          />
          <Composer 
            onSendMessage={handleSendMessage}
            disabled={status === 'sending'}
          />
        </main>
      </div>
      <StatusBar status={status} message={statusMessage} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ChatContent />
      </AuthProvider>
    </ApolloProvider>
  );
}