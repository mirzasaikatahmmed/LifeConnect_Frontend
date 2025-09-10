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
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string; user?: User; role?: string }>;
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

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; message?: string; user?: User; role?: string }> => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        email,
        password,
      });

      // Backend returns { access_token, admin } structure
      if (response.data && response.data.access_token) {
        console.log('Full response from backend:', JSON.stringify(response.data, null, 2)); // Debug log
        
        const { access_token, admin } = response.data;
        
        // Store token with expiration based on rememberMe
        setToken(access_token);
        TokenStorage.setToken(access_token, rememberMe);
        
        // Set up axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        
        // Store user data
        if (admin) {
          console.log('Admin object from backend:', JSON.stringify(admin, null, 2)); // Debug log
          
          // Handle different role formats from backend - try all possible ways
          let userRole = null;
          
          // Try different possible role locations
          if (admin.role && typeof admin.role === 'object' && admin.role.name) {
            userRole = admin.role.name;
            console.log('Found role in admin.role.name:', userRole);
          } else if (admin.role && typeof admin.role === 'string') {
            userRole = admin.role;
            console.log('Found role in admin.role (string):', userRole);
          } else if (admin.userType) {
            userRole = admin.userType;
            console.log('Found role in admin.userType:', userRole);
          } else if (admin.roleId) {
            // If we only have roleId, map it to role name
            userRole = admin.roleId === 1 ? 'admin' : admin.roleId === 2 ? 'manager' : 'user';
            console.log('Mapped roleId to role name:', admin.roleId, '->', userRole);
          }
          
          console.log('Final extracted role:', userRole); // Debug log
          
          const userData = {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: userRole
          };
          setUser(userData);
          
          return { 
            success: true, 
            user: userData,
            role: userRole 
          };
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