'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, User } from '@/lib/api';
import { storage } from '@/lib/utils';
import { message } from 'antd';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken();
      const storedUser = storage.getUser();

      if (token && storedUser) {
        try {
          setUser(storedUser);
        } catch (error) {
          console.error('Authentication failed', error);
          storage.clearAuth();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        storage.setToken(response.token);
        storage.setUser(response.user);
        setUser(response.user);
        
        // Redirect based on user role
        if (response.user.role === 'syndic' || response.user.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/resident-dashboard');
        }
        
        message.success('Login successful!');
      }
    } catch (error: any) {
      message.error(error.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'syndic') => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ name, email, password, role });
      
      if (response.success) {
        storage.setToken(response.token);
        storage.setUser(response.user);
        setUser(response.user);
        
        router.push('/dashboard');
        message.success(response.message || 'Registration successful!');
      }
    } catch (error: any) {
      message.error(error.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.clearAuth();
    setUser(null);
    router.push('/login');
    message.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};