import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/databaseClient';

const BecomeSeller: React.FC = () => {
  const { user, isAuthenticated, updateSellerStatus } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    address: '',
    gstNumber: '',
    contactEmail: user?.email || '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const sellerData = {
        user_id: user!.id,
        business_name: formData.businessName,
        description: formData.description,
        address: formData.address,
        gst_number: formData.gstNumber,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        status: 'approved' // Make seller approved when they register
      };

      const { error } = await db.getSellerProfile(user!.id);
      
      if (error && error.message.includes('No rows returned')) {
        // User is not a seller yet, create seller profile
        const { error: createError } = await db.createSellerProfile(sellerData);
        if (createError) throw createError;
        
        // Update seller status in auth context
        await updateSellerStatus(user!.id);
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/seller/dashboard?tab=products');
        }, 2000);
      } else {
        setError('You are already registered as a seller');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register as seller');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to BazaarLink!</h2>
          <p className="text-gray-600 mb-6">
            Your seller account has been created successfully. 
            You can now start listing your products and managing your inventory.
          </p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Become a Seller</h1>
            <p className="text-gray-600">Join our marketplace and start selling your products</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-gray-700 font-medium mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                placeholder="Your business name"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Business Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                placeholder="Tell us about your business..."
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                Business Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                placeholder="Your business address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gstNumber" className="block text-gray-700 font-medium mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  id="gstNumber"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                  placeholder="GST Number (optional)"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-gray-700 font-medium mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                  placeholder="Contact phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-gray-700 font-medium mb-2">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                placeholder="Contact email"
                required
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">What you can do now:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Start listing your products immediately</li>
                <li>• Manage your inventory and orders</li>
                <li>• Track your sales and analytics</li>
                <li>• Connect with buyers and wholesalers</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 bg-brand-green-600 text-white rounded-lg font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-green-700'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller; 