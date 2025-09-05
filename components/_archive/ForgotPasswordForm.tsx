'use client';

import { useState } from 'react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
}

export default function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label htmlFor="forgot-email" className="form-label">Email</label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          placeholder="Enter your email address"
          required
        />
      </div>
      
      <button type="submit" className="auth-button">Reset Password</button>
    </form>
  );
}