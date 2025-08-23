// Database types
export interface Chat {
  id: string;
  title: string;
  owner_id: string;
  updated_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_role: 'user' | 'assistant';
  sender_id: string;
  content: string;
  created_at: string;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// GraphQL operation types
export interface GetChatsForUserVariables {
  limit?: number;
  offset?: number;
}

export interface GetChatsForUserData {
  chats: Chat[];
}

export interface GetMessagesForChatVariables {
  chat_id: string;
  limit?: number;
  offset?: number;
}

export interface GetMessagesForChatData {
  messages: Message[];
}

export interface OnMessagesVariables {
  chat_id: string;
}

export interface OnMessagesData {
  messages: Message[];
}

export interface InsertUserMessageVariables {
  obj: {
    chat_id: string;
    sender_role: 'user';
    sender_id: string;
    content: string;
  };
}

export interface InsertUserMessageData {
  insert_messages_one: Message;
}

export interface SendMessageActionVariables {
  chat_id: string;
  text: string;
}

export interface SendMessageActionData {
  sendMessage: {
    success: boolean;
    bot_response?: string;
    bot_message_id?: string;
    error?: string;
  };
}

// UI component types
export interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

export interface ComposerProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface StatusBarProps {
  status: 'idle' | 'sending' | 'waiting' | 'error';
  error?: string;
}