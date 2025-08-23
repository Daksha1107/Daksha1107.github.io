'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '@/types';
import { updateAuthToken } from '@/lib/apollo';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          accessToken: token,
          isLoading: false,
          isAuthenticated: true,
        });
        updateAuthToken(token);
      } catch {
        // Clear invalid stored data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // In a real app, this would call your auth service
      // For now, we'll simulate a successful login
      const mockUser: User = {
        id: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Store auth data
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setAuthState({
        user: mockUser,
        accessToken: mockToken,
        isLoading: false,
        isAuthenticated: true,
      });
      
      updateAuthToken(mockToken);
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const signup = async (email: string, _password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // In a real app, this would call your auth service
      // For now, we'll simulate a successful signup
      await login(email, _password);
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
    updateAuthToken(null);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}