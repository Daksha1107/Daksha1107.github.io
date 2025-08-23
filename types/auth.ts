export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export interface HasuraJWTClaims {
  'https://hasura.io/jwt/claims': {
    'x-hasura-default-role': string;
    'x-hasura-allowed-roles': string[];
    'x-hasura-user-id': string;
    'x-hasura-email-verified': string;
  };
}

export interface JWTPayload extends HasuraJWTClaims {
  sub: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
}

export interface BoltAuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface VerificationData {
  token: string;
  userId: string;
}