'use client';

import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const handleForgotPassword = (email: string) => {
    console.log('Forgot password request for:', email);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        </div>
        
        <ForgotPasswordForm onSubmit={handleForgotPassword} />
        
        <div className="auth-links">
          <a href="/login" className="auth-link">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}