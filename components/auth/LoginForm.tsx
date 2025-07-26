import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC<{ 
  onToggleForm: () => void; 
  onSuccess?: () => void;
  onOTPRequired?: (email: string) => void;
}> = ({ onToggleForm, onSuccess, onOTPRequired }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      
      // For demo purposes, always require OTP
      if (onOTPRequired) {
        onOTPRequired(email);
        return;
      }
      
      // Close modal on successful sign in
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In to BazaarLink</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
          <input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
            placeholder="••••••••"
            required
          />
          <div className="mt-1 text-right">
            <a href="#" className="text-sm text-brand-green-600 hover:underline">Forgot Password?</a>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-brand-green-600 text-white py-2 px-4 rounded-lg font-medium ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-green-700'
          }`}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={onToggleForm} 
            className="text-brand-green-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;