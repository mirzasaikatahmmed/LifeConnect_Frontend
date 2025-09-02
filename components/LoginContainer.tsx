'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginContainer() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    console.log('Login attempt:', { email, password });
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please sign in to your account</p>
        </div>
        
        {isLoading && (
          <div className="auth-message">
            <p>Signing in...</p>
          </div>
        )}
        
        <LoginForm onSubmit={handleLogin} />
        
        <div className="auth-links">
          <Link href="/login/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
          <span className="auth-divider">•</span>
          <Link href="/register" className="auth-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}