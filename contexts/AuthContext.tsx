'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { TokenStorage } from '@/lib/tokenStorage';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = TokenStorage.getToken();
    if (savedToken) {
      setToken(savedToken);
      // Set up axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      
      // Optionally verify token and get user info
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      // You can add a verify endpoint call here if needed
      // For now, we'll just assume the token is valid if it exists
      setLoading(false);
    } catch (error) {
      // Token is invalid
      logout();
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        email,
        password,
      });

      // Backend returns { access_token, admin } structure
      if (response.data && response.data.access_token) {
        const { access_token, admin } = response.data;
        
        // Store token with expiration based on rememberMe
        setToken(access_token);
        TokenStorage.setToken(access_token, rememberMe);
        
        // Set up axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Store user data
        if (admin) {
          setUser({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.userType || admin.role?.name
          });
        }

        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'Invalid response from server' 
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    TokenStorage.removeToken();
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}