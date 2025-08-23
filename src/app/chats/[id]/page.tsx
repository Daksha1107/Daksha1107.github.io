'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useSubscription } from '@apollo/client/react';
import { useAuth } from '@/lib/auth';
import {
  GET_MESSAGES_FOR_CHAT,
  INSERT_USER_MESSAGE,
  SEND_MESSAGE_ACTION,
  ON_MESSAGES,
} from '@/graphql/operations';
import {
  GetMessagesForChatData,
  GetMessagesForChatVariables,
  InsertUserMessageData,
  InsertUserMessageVariables,
  SendMessageActionData,
  SendMessageActionVariables,
  OnMessagesData,
  OnMessagesVariables,
} from '@/types';
import { AppLayout } from '@/components/layout/app-layout';
import { MessageList } from '@/components/chat/message-list';
import { Composer } from '@/components/chat/composer';
import { StatusBar } from '@/components/chat/status-bar';

export default function ChatPage() {
  const params = useParams();
  const { user } = useAuth();
  const chatId = params.id as string;
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'waiting' | 'error'>('idle');
  const [statusError, setStatusError] = useState<string | undefined>();

  // Query for initial messages
  const { data: messagesData, loading: messagesLoading } = useQuery<
    GetMessagesForChatData,
    GetMessagesForChatVariables
  >(GET_MESSAGES_FOR_CHAT, {
    variables: { chat_id: chatId },
    errorPolicy: 'all',
  });

  // Subscribe to real-time messages
  const { data: subscriptionData } = useSubscription<OnMessagesData, OnMessagesVariables>(
    ON_MESSAGES,
    {
      variables: { chat_id: chatId },
      errorPolicy: 'all',
    }
  );

  // Mutations
  const [insertUserMessage] = useMutation<InsertUserMessageData, InsertUserMessageVariables>(
    INSERT_USER_MESSAGE
  );

  const [sendMessageAction] = useMutation<SendMessageActionData, SendMessageActionVariables>(
    SEND_MESSAGE_ACTION
  );

  // Use subscription data if available, otherwise fall back to query data
  const messages = subscriptionData?.messages || messagesData?.messages || [];

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    try {
      setSendingStatus('sending');
      setStatusError(undefined);

      // Step 1: Insert user message
      await insertUserMessage({
        variables: {
          obj: {
            chat_id: chatId,
            sender_role: 'user',
            sender_id: user.id,
            content: text,
          },
        },
      });

      setSendingStatus('waiting');

      // Step 2: Trigger bot response via Hasura Action
      const actionResult = await sendMessageAction({
        variables: {
          chat_id: chatId,
          text: text,
        },
      });

      if (!actionResult.data?.sendMessage.success) {
        throw new Error(actionResult.data?.sendMessage.error || 'Failed to send message');
      }

      setSendingStatus('idle');
    } catch (error) {
      console.error('Failed to send message:', error);
      setSendingStatus('error');
      setStatusError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setSendingStatus('idle');
        setStatusError(undefined);
      }, 5000);
    }
  };

  if (!chatId) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Invalid Chat</h2>
            <p className="text-foreground-muted">The chat ID is missing or invalid.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        {/* Status Bar */}
        <StatusBar status={sendingStatus} error={statusError} />

        {/* Messages */}
        <div className="flex-1 flex flex-col min-h-0">
          {messagesLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <MessageList 
              messages={messages} 
              isLoading={sendingStatus === 'waiting'} 
            />
          )}
        </div>

        {/* Composer */}
        <Composer
          onSendMessage={handleSendMessage}
          isLoading={sendingStatus === 'sending' || sendingStatus === 'waiting'}
          disabled={sendingStatus === 'error'}
        />
      </div>
    </AppLayout>
  );
}