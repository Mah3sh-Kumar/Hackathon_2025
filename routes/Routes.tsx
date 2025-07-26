import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import App from '../App';
import SellerDashboard from '../components/seller/SellerDashboard';
import BecomeSeller from '../components/seller/BecomeSeller';
import Marketplace from '../components/marketplace/Marketplace';
import ProductDetail from '../components/product/ProductDetail';
import WholesalerSection from '../components/WholesalerSection';
import { useAuth } from '../hooks/useAuth';
import { db } from '../utils/databaseClient';

// Protected route component that redirects to home if not authenticated
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode; 
  condition: boolean; 
  redirectTo: string;
}> = ({ element, condition, redirectTo }) => {
  return condition ? <>{element}</> : <Navigate to={redirectTo} />;
};

const Routes: React.FC = () => {
  const { isAuthenticated, isSeller, loading } = useAuth();

  useEffect(() => {
    // Initialize the database connection
    const initDB = async () => {
      try {
        await db.init();
        if (!db.isUsingSupabase()) {
          console.warn('Supabase connection failed. Using localStorage fallback.');
        }
      } catch (error) {
        console.error('Database initialization error:', error);
        // Continue with the app even if database init fails
      }
    };

    initDB();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-600"></div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouterRoutes>
        {/* Main public route */}
        <Route path="/" element={<App />} />
        
        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />
        
                        {/* Product Detail */}
                <Route path="/product/:id" element={<ProductDetail />} />
                
                {/* Wholesaler Section */}
                <Route path="/wholesale" element={<WholesalerSection />} />
                
                {/* Become Seller - Protected Route */}
                <Route
                  path="/become-seller"
                  element={
                    <ProtectedRoute
                      element={<BecomeSeller />}
                      condition={isAuthenticated}
                      redirectTo="/"
                    />
                  }
                />
        
        {/* Seller Dashboard - Protected Route */}
        <Route
          path="/seller/*"
          element={
            <ProtectedRoute
              element={<SellerDashboard />}
              condition={isAuthenticated && isSeller}
              redirectTo="/"
            />
          }
        />
        
        {/* User Dashboard - Protected Route (to be implemented later) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute
              element={<div>User Dashboard (Coming Soon)</div>}
              condition={isAuthenticated}
              redirectTo="/"
            />
          }
        />
        
        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </Router>
  );
};

export default Routes;