import React, { useState, useEffect } from 'react';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
  type: 'login' | 'signup';
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  onVerify, 
  onResend, 
  onCancel, 
  type 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onVerify(otpString);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendTimer(60); // 60 seconds cooldown
    try {
      await onResend();
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl text-brand-green-600 mb-4">
          <i className="fas fa-envelope"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-gray-800 font-medium">{email}</p>
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <i className="fas fa-info-circle mr-1"></i>
          Demo: Use any 6-digit number (e.g., 123456)
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-3 text-center">
            Enter 6-digit OTP
          </label>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-brand-green-500 focus:ring-2 focus:ring-brand-green-200"
                placeholder="0"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className={`w-full bg-brand-green-600 text-white py-3 px-4 rounded-lg font-medium mb-4 ${
            loading || otp.join('').length !== 6
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-brand-green-700'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="text-center space-y-3">
        <p className="text-gray-600 text-sm">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResendOTP}
          disabled={resendTimer > 0}
          className={`text-brand-green-600 font-medium text-sm ${
            resendTimer > 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:underline'
          }`}
        >
          {resendTimer > 0 
            ? `Resend in ${resendTimer}s` 
            : 'Resend OTP'
          }
        </button>

        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            <i className="fas fa-arrow-left mr-1"></i>
            Back to {type === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 