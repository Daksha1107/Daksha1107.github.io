import { gql } from '@apollo/client';

// Query to get chats for user
export const GET_CHATS_FOR_USER = gql`
  query GetChatsForUser($limit: Int = 50, $offset: Int = 0) {
    chats(order_by: { updated_at: desc }, limit: $limit, offset: $offset) {
      id
      title
      owner_id
      updated_at
      created_at
    }
  }
`;

// Query to get messages for chat
export const GET_MESSAGES_FOR_CHAT = gql`
  query GetMessagesForChat($chat_id: uuid!, $limit: Int = 200, $offset: Int = 0) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }, limit: $limit, offset: $offset) {
      id
      chat_id
      sender_role
      sender_id
      content
      created_at
    }
  }
`;

// Subscription for real-time messages
export const ON_MESSAGES = gql`
  subscription OnMessages($chat_id: uuid!) {
    messages(where: { chat_id: { _eq: $chat_id } }, order_by: { created_at: asc }) {
      id
      chat_id
      sender_role
      sender_id
      content
      created_at
    }
  }
`;

// Mutation to insert user message
export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($obj: messages_insert_input!) {
    insert_messages_one(object: $obj) {
      id
      chat_id
      sender_role
      sender_id
      content
      created_at
    }
  }
`;

// Mutation to trigger bot response via Hasura Action
export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessageAction($chat_id: uuid!, $text: String!) {
    sendMessage(input: { chat_id: $chat_id, text: $text }) {
      success
      bot_response
      bot_message_id
      error
    }
  }
`;

// Mutation to create a new chat
export const CREATE_CHAT = gql`
  mutation CreateChat($obj: chats_insert_input!) {
    insert_chats_one(object: $obj) {
      id
      title
      owner_id
      created_at
      updated_at
    }
  }
`;