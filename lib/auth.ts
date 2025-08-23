import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import type { 
  User, 
  AuthState, 
  JWTPayload, 
  BoltAuthResponse, 
  SignupData, 
  SigninData,
  VerificationData 
} from '@/types/auth';

// Environment variables
const BOLT_API_KEY = process.env.BOLT_API_KEY || '';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const BOLT_API_ENDPOINT = 'https://api.bolt.com/v1'; // Replace with actual Bolt API endpoint

// Token storage keys
const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    token: null
  };

  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Subscribe to auth state changes
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  private updateAuthState(updates: Partial<AuthState>) {
    this.authState = { ...this.authState, ...updates };
    this.notifyListeners();
  }

  // Generate JWT token with Hasura claims
  private generateJWT(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      email_verified: user.emailVerified,
      'https://hasura.io/jwt/claims': {
        'x-hasura-default-role': 'user',
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-user-id': user.id,
        'x-hasura-email-verified': user.emailVerified.toString()
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  // Verify JWT token
  private verifyJWT(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  // Decode JWT without verification (for client-side)
  private decodeJWT(token: string): JWTPayload | null {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('JWT decode failed:', error);
      return null;
    }
  }

  // Store tokens in localStorage
  private storeTokens(accessToken: string, refreshToken?: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  // Get stored token
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
  }

  // Remove stored tokens
  private clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // Initialize auth state from stored token
  async initialize(): Promise<void> {
    this.updateAuthState({ isLoading: true });

    try {
      const token = this.getStoredToken();
      if (!token) {
        this.updateAuthState({ isLoading: false });
        return;
      }

      const payload = this.decodeJWT(token);
      if (!payload) {
        this.clearTokens();
        this.updateAuthState({ isLoading: false });
        return;
      }

      // Check if token is expired
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        this.clearTokens();
        this.updateAuthState({ isLoading: false });
        return;
      }

      // Reconstruct user from JWT payload
      const user: User = {
        id: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified,
        createdAt: new Date().toISOString(), // We don't have this in JWT
        updatedAt: new Date().toISOString()  // We don't have this in JWT
      };

      this.updateAuthState({
        user,
        isAuthenticated: true,
        token,
        isLoading: false
      });
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.clearTokens();
      this.updateAuthState({ isLoading: false });
    }
  }

  // Sign up with email and password
  async signup(data: SignupData): Promise<{ success: boolean; message: string }> {
    this.updateAuthState({ isLoading: true });

    try {
      // Mock Bolt API call - replace with actual Bolt integration
      const response = await axios.post(`${BOLT_API_ENDPOINT}/auth/signup`, {
        email: data.email,
        password: data.password
      }, {
        headers: {
          'Authorization': `Bearer ${BOLT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const result: BoltAuthResponse = response.data;

      // For now, simulate email verification pending
      return {
        success: true,
        message: 'Signup successful! Please check your email for verification link.'
      };
    } catch (error: any) {
      console.error('Signup failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      };
    } finally {
      this.updateAuthState({ isLoading: false });
    }
  }

  // Sign in with email and password
  async signin(data: SigninData): Promise<{ success: boolean; message: string }> {
    this.updateAuthState({ isLoading: true });

    try {
      // Mock Bolt API call - replace with actual Bolt integration
      const response = await axios.post(`${BOLT_API_ENDPOINT}/auth/signin`, {
        email: data.email,
        password: data.password
      }, {
        headers: {
          'Authorization': `Bearer ${BOLT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const result: BoltAuthResponse = response.data;

      // Check if email is verified
      if (!result.user.emailVerified) {
        return {
          success: false,
          message: 'Please verify your email before signing in.'
        };
      }

      // Generate JWT with Hasura claims
      const token = this.generateJWT(result.user);
      this.storeTokens(token, result.refresh_token);

      this.updateAuthState({
        user: result.user,
        isAuthenticated: true,
        token,
        isLoading: false
      });

      return {
        success: true,
        message: 'Signin successful!'
      };
    } catch (error: any) {
      console.error('Signin failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Signin failed. Please check your credentials.'
      };
    } finally {
      this.updateAuthState({ isLoading: false });
    }
  }

  // Verify email with token
  async verifyEmail(data: VerificationData): Promise<{ success: boolean; message: string; user?: User }> {
    this.updateAuthState({ isLoading: true });

    try {
      // Mock Bolt API call - replace with actual Bolt integration
      const response = await axios.post(`${BOLT_API_ENDPOINT}/auth/verify`, {
        token: data.token,
        userId: data.userId
      }, {
        headers: {
          'Authorization': `Bearer ${BOLT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const result: BoltAuthResponse = response.data;

      // Generate JWT with Hasura claims
      const token = this.generateJWT(result.user);
      this.storeTokens(token, result.refresh_token);

      this.updateAuthState({
        user: result.user,
        isAuthenticated: true,
        token,
        isLoading: false
      });

      return {
        success: true,
        message: 'Email verification successful!',
        user: result.user
      };
    } catch (error: any) {
      console.error('Email verification failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed. Please try again.'
      };
    } finally {
      this.updateAuthState({ isLoading: false });
    }
  }

  // Sign out
  async signout(): Promise<void> {
    this.updateAuthState({ isLoading: true });

    try {
      // Call Bolt API to invalidate tokens if needed
      this.clearTokens();
      this.updateAuthState({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Signout failed:', error);
      // Force clear local state even if API call fails
      this.clearTokens();
      this.updateAuthState({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false
      });
    }
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState;
  }

  // Get current token
  getToken(): string | null {
    return this.authState.token || this.getStoredToken();
  }

  // Check if user is authenticated and email is verified
  isEmailVerified(): boolean {
    return this.authState.isAuthenticated && this.authState.user?.emailVerified === true;
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Mock Bolt API call - replace with actual Bolt integration
      await axios.post(`${BOLT_API_ENDPOINT}/auth/resend-verification`, {
        email
      }, {
        headers: {
          'Authorization': `Bearer ${BOLT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        message: 'Verification email sent successfully!'
      };
    } catch (error: any) {
      console.error('Resend verification failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend verification email.'
      };
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();