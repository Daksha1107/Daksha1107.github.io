import { GraphQLClient } from 'graphql-request';
import { authService } from './auth';

// Environment variables
const HASURA_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8080/v1/graphql';
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '';

export class HasuraClient {
  private client: GraphQLClient;
  private adminClient: GraphQLClient;

  constructor() {
    // Client with user authentication
    this.client = new GraphQLClient(HASURA_GRAPHQL_ENDPOINT, {
      headers: this.getAuthHeaders(),
    });

    // Admin client for server-side operations
    this.adminClient = new GraphQLClient(HASURA_GRAPHQL_ENDPOINT, {
      headers: {
        'x-hasura-admin-secret': HASURA_GRAPHQL_ADMIN_SECRET,
      },
    });
  }

  private getAuthHeaders(): Record<string, string> {
    const token = authService.getToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
      };
    }
    return {};
  }

  // Update client headers when auth state changes
  updateAuthHeaders() {
    this.client = new GraphQLClient(HASURA_GRAPHQL_ENDPOINT, {
      headers: this.getAuthHeaders(),
    });
  }

  // Make authenticated request
  async request<T = any>(query: string, variables?: any): Promise<T> {
    try {
      this.updateAuthHeaders();
      return await this.client.request<T>(query, variables);
    } catch (error: any) {
      console.error('Hasura request failed:', error);
      
      // If unauthorized, clear auth state
      if (error.response?.status === 401) {
        await authService.signout();
      }
      
      throw error;
    }
  }

  // Make admin request (server-side only)
  async adminRequest<T = any>(query: string, variables?: any): Promise<T> {
    try {
      return await this.adminClient.request<T>(query, variables);
    } catch (error) {
      console.error('Hasura admin request failed:', error);
      throw error;
    }
  }

  // Get client instance for direct use
  getClient(): GraphQLClient {
    this.updateAuthHeaders();
    return this.client;
  }

  // Get admin client instance for direct use
  getAdminClient(): GraphQLClient {
    return this.adminClient;
  }
}

// GraphQL queries and mutations
export const GRAPHQL_QUERIES = {
  // User queries
  GET_USER_PROFILE: `
    query GetUserProfile {
      users(where: {id: {_eq: $userId}}) {
        id
        email
        email_verified
        created_at
        updated_at
      }
    }
  `,

  // Chat queries (require email verification)
  GET_CHAT_MESSAGES: `
    query GetChatMessages($limit: Int = 50, $offset: Int = 0) {
      chat_messages(
        limit: $limit
        offset: $offset
        order_by: {created_at: desc}
        where: {user: {email_verified: {_eq: true}}}
      ) {
        id
        content
        created_at
        user {
          id
          email
        }
      }
    }
  `,

  CREATE_CHAT_MESSAGE: `
    mutation CreateChatMessage($content: String!) {
      insert_chat_messages_one(
        object: {content: $content}
        _presets: [{user_id: "x-hasura-user-id"}]
      ) {
        id
        content
        created_at
        user {
          id
          email
        }
      }
    }
  `,

  // User management
  UPDATE_USER_EMAIL_VERIFICATION: `
    mutation UpdateUserEmailVerification($userId: String!, $emailVerified: Boolean!) {
      update_users_by_pk(
        pk_columns: {id: $userId}
        _set: {email_verified: $emailVerified}
      ) {
        id
        email
        email_verified
        updated_at
      }
    }
  `,

  CREATE_USER: `
    mutation CreateUser($id: String!, $email: String!, $emailVerified: Boolean = false) {
      insert_users_one(
        object: {
          id: $id
          email: $email
          email_verified: $emailVerified
        }
        on_conflict: {
          constraint: users_pkey
          update_columns: [email, email_verified]
        }
      ) {
        id
        email
        email_verified
        created_at
        updated_at
      }
    }
  `,
};

// Type definitions for GraphQL responses
export interface HasuraUser {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface HasuraChatMessage {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    email: string;
  };
}

export interface GetChatMessagesResponse {
  chat_messages: HasuraChatMessage[];
}

export interface CreateChatMessageResponse {
  insert_chat_messages_one: HasuraChatMessage;
}

export interface GetUserProfileResponse {
  users: HasuraUser[];
}

export interface UpdateUserEmailVerificationResponse {
  update_users_by_pk: HasuraUser;
}

export interface CreateUserResponse {
  insert_users_one: HasuraUser;
}

// Export singleton instance
export const hasuraClient = new HasuraClient();

// Helper function to check if user has verified email for Hasura operations
export const requireEmailVerification = () => {
  const authState = authService.getAuthState();
  if (!authState.isAuthenticated) {
    throw new Error('User not authenticated');
  }
  if (!authState.user?.emailVerified) {
    throw new Error('Email verification required');
  }
  return true;
};