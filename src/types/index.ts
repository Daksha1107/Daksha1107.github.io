export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Chat {
  id: string;
  title: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_role: 'user' | 'assistant' | 'system';
  sender_id?: string;
  content: string;
  created_at: string;
}

export interface SendMessageActionResponse {
  success: boolean;
  bot_response?: string;
  bot_message_id?: string;
  error?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}