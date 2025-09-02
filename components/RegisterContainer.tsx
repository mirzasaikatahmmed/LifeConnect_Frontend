'use client';

import { useState } from 'react';
import Link from 'next/link';
import RegisterForm from './RegisterForm';

export default function RegisterContainer() {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    console.log('Register attempt:', { email, password });
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join LifeConnect and start building communities</p>
        </div>
        
        {isLoading && (
          <div className="auth-message">
            <p>Creating account...</p>
          </div>
        )}
        
        <RegisterForm onSubmit={handleRegister} />
        
        <div className="auth-links">
          <Link href="/login" className="auth-link">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}