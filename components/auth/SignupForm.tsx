import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../utils/supabaseClient';

const SignupForm: React.FC<{ 
  onToggleForm: () => void; 
  onSuccess?: () => void;
  onOTPRequired?: (email: string) => void;
}> = ({ onToggleForm, onSuccess, onOTPRequired }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Create user with Supabase
      const { error: signUpError, user } = await signUp(email, password, {
        full_name: fullName,
        is_seller: isSeller,
      });

      if (signUpError) throw signUpError;
      
      // If user wants to be a seller, create a seller profile
      if (user && isSeller) {
        // Add a record to the sellers table
        const { error: sellerError } = await supabase
          .from('sellers')
          .insert([
            { 
              user_id: user.id,
              business_name: businessName,
              status: 'pending', // pending verification
              created_at: new Date().toISOString(),
            }
          ]);
          
        if (sellerError) throw sellerError;
      }
      
      // For demo purposes, always require OTP
      if (onOTPRequired) {
        onOTPRequired(email);
        return;
      }
      
      // Show success message
      alert("Account created successfully! Please check your email to verify your account.");
      
      // Close modal on successful sign up
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input 
            id="fullName"
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
            placeholder="Your Name"
            required
          />
        </div>
        
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
        
        <div className="mb-4">
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
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input 
            id="confirmPassword"
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input 
              id="isSeller" 
              type="checkbox"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
              className="h-4 w-4 text-brand-green-600 focus:ring-brand-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isSeller" className="ml-2 block text-sm text-gray-700">
              I want to register as a wholesaler/seller
            </label>
          </div>
        </div>
        
        {isSeller && (
          <div className="mb-6">
            <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2">Business Name</label>
            <input 
              id="businessName"
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
              placeholder="Your Business Name"
              required
            />
          </div>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          className={`w-full bg-brand-green-600 text-white py-2 px-4 rounded-lg font-medium ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-green-700'
          }`}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={onToggleForm} 
            className="text-brand-green-600 font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;