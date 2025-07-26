import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const SellerDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'products', 'orders', 'analytics'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="https://picsum.photos/seed/logo/50/50" alt="BazaarLink logo" className="h-8 w-8 rounded-full object-cover"/>
                <h1 className="text-xl font-bold text-brand-green-700 ml-2">BazaarLink</h1>
              </Link>
              <span className="ml-4 text-gray-500">|</span>
              <span className="ml-4 text-gray-700 font-medium">Seller Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700">
                  {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-brand-green-500 text-brand-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-chart-line mr-2"></i>
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-brand-green-500 text-brand-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-box mr-2"></i>
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-brand-green-500 text-brand-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-brand-green-500 text-brand-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Analytics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-box text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-shopping-cart text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <i className="fas fa-rupee-sign text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹45,230</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <i className="fas fa-eye text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + i}</p>
                  <p className="text-sm text-gray-600">2 items • ₹1,250</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alert</h3>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Product {i}</p>
                  <p className="text-sm text-gray-600">Only {i} left in stock</p>
                </div>
                <button className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full hover:bg-red-200">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Tab Component
const ProductsTab: React.FC = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const handleProductSubmit = (productData: any) => {
    // For demo purposes, create a mock product
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
    setShowAddProduct(false);
  };

  const handleProductDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => setShowAddProduct(true)}
          className="bg-brand-green-600 text-white px-6 py-3 rounded-lg hover:bg-brand-green-700 flex items-center font-medium"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Product
        </button>
      </div>

      {showAddProduct ? (
        <ProductForm 
          onSubmit={handleProductSubmit}
          onCancel={() => setShowAddProduct(false)}
        />
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="mb-4 text-gray-400">
            <i className="fas fa-box-open text-6xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Yet</h3>
          <p className="text-gray-500 mb-6">Start selling by adding your first product to the marketplace.</p>
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-brand-green-600 text-white px-6 py-3 rounded-lg hover:bg-brand-green-700 font-medium"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Your First Product
          </button>
        </div>
      ) : (
        <ProductList 
          products={products}
          onDelete={handleProductDelete}
        />
      )}
    </div>
  );
};

// Orders Tab Component
const OrdersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No orders yet</p>
              <p className="text-sm text-gray-400">Orders will appear here once customers start buying your products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <i className="fas fa-chart-bar text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Analytics coming soon</p>
              <p className="text-sm text-gray-400">Detailed analytics and insights will be available here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;