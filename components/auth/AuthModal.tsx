import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import OTPVerification from './OTPVerification';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

type AuthView = 'login' | 'signup' | 'otp';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<AuthView>(initialView);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState<'login' | 'signup'>('login');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-200"
            aria-label="Close modal"
          >
            <i className="fas fa-times fa-lg"></i>
          </button>
          
          {view === 'login' && (
            <LoginForm 
              onToggleForm={() => setView('signup')} 
              onSuccess={onClose}
              onOTPRequired={(email) => {
                setOtpEmail(email);
                setOtpType('login');
                setView('otp');
              }}
            />
          )}
          {view === 'signup' && (
            <SignupForm 
              onToggleForm={() => setView('login')} 
              onSuccess={onClose}
              onOTPRequired={(email) => {
                setOtpEmail(email);
                setOtpType('signup');
                setView('otp');
              }}
            />
          )}
          {view === 'otp' && (
            <OTPVerification
              email={otpEmail}
              type={otpType}
              onVerify={async (otp) => {
                // For demo purposes, accept any 6-digit OTP
                if (otp.length === 6 && /^\d{6}$/.test(otp)) {
                  console.log('OTP verified:', otp);
                  onClose();
                } else {
                  throw new Error('Invalid OTP. Please enter a 6-digit code.');
                }
              }}
              onResend={async () => {
                // For demo purposes, just show a message
                console.log('Resending OTP to:', otpEmail);
                alert('OTP resent! For demo purposes, use any 6-digit number.');
              }}
              onCancel={() => setView(otpType)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;