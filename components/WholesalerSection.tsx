import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const WholesalerSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('wholesalers');

  const wholesalers = [
    {
      id: '1',
      name: 'TechWholesale Pro',
      description: 'Leading wholesaler of electronics and gadgets',
      rating: 4.8,
      products: 1250,
      location: 'Mumbai, Maharashtra',
      image: 'https://picsum.photos/200/200?random=10'
    },
    {
      id: '2',
      name: 'FashionHub Wholesale',
      description: 'Premium clothing and accessories wholesaler',
      rating: 4.6,
      products: 890,
      location: 'Delhi, NCR',
      image: 'https://picsum.photos/200/200?random=11'
    },
    {
      id: '3',
      name: 'HomeStyle Bulk',
      description: 'Home and kitchen products at wholesale prices',
      rating: 4.7,
      products: 650,
      location: 'Bangalore, Karnataka',
      image: 'https://picsum.photos/200/200?random=12'
    },
    {
      id: '4',
      name: 'SportsGear Wholesale',
      description: 'Sports equipment and fitness gear wholesaler',
      rating: 4.5,
      products: 420,
      location: 'Chennai, Tamil Nadu',
      image: 'https://picsum.photos/200/200?random=13'
    }
  ];

  const bulkProducts = [
    {
      id: '1',
      title: 'Wireless Earbuds - Bulk Pack',
      description: 'High-quality wireless earbuds, minimum order 50 units',
      price: 299,
      bulkPrice: 249,
      minOrder: 50,
      category: 'Electronics',
      image: 'https://picsum.photos/300/200?random=20'
    },
    {
      id: '2',
      title: 'Organic Cotton T-Shirts',
      description: 'Premium organic cotton t-shirts, various sizes available',
      price: 599,
      bulkPrice: 449,
      minOrder: 100,
      category: 'Clothing',
      image: 'https://picsum.photos/300/200?random=21'
    },
    {
      id: '3',
      title: 'Smartphone Cases - Assorted',
      description: 'Durable smartphone cases for all major brands',
      price: 199,
      bulkPrice: 149,
      minOrder: 200,
      category: 'Electronics',
      image: 'https://picsum.photos/300/200?random=22'
    },
    {
      id: '4',
      title: 'Kitchen Utensils Set',
      description: 'Complete kitchen utensil set, perfect for restaurants',
      price: 899,
      bulkPrice: 699,
      minOrder: 25,
      category: 'Home & Kitchen',
      image: 'https://picsum.photos/300/200?random=23'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Wholesale Marketplace</h1>
          <p className="text-gray-600 mb-6">
            Connect with verified wholesalers and get bulk products at competitive prices
          </p>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('wholesalers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'wholesalers'
                    ? 'border-brand-green-500 text-brand-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-store mr-2"></i>
                Wholesalers
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
                Bulk Products
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'wholesalers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Verified Wholesalers</h2>
              {isAuthenticated && (
                <Link
                  to="/become-wholesaler"
                  className="bg-brand-green-600 text-white px-4 py-2 rounded-lg hover:bg-brand-green-700 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Become a Wholesaler
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wholesalers.map(wholesaler => (
                <div key={wholesaler.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={wholesaler.image}
                        alt={wholesaler.name}
                        className="h-16 w-16 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{wholesaler.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          {wholesaler.rating} ({wholesaler.products} products)
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{wholesaler.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {wholesaler.location}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/wholesaler/${wholesaler.id}`}
                        className="flex-1 bg-brand-green-600 text-white py-2 px-4 rounded-lg hover:bg-brand-green-700 transition-colors text-center"
                      >
                        View Profile
                      </Link>
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        <i className="fas fa-envelope"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bulk Products</h2>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Home & Kitchen</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500">
                  <option>Sort by</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Minimum Order</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bulkProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-48 w-full object-cover rounded-t-lg"
                  />
                  
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                        <span className="text-xl font-bold text-brand-green-600 ml-2">₹{product.bulkPrice}</span>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Min: {product.minOrder}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-brand-green-600 text-white py-2 px-4 rounded-lg hover:bg-brand-green-700 transition-colors">
                        <i className="fas fa-shopping-cart mr-2"></i>
                        Contact Seller
                      </button>
                      <Link
                        to={`/bulk-product/${product.id}`}
                        className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesalerSection;