import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/databaseClient';
import { Product } from '../seller/ProductForm';

const Marketplace: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'all',
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Wellness',
    'Automotive',
    'Others'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getProducts();
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      // For demo, add some mock products
      setProducts([
        {
          id: '1',
          title: 'Wireless Bluetooth Headphones',
          description: 'High-quality wireless headphones with noise cancellation',
          price: 1299,
          category: 'Electronics',
          image_urls: ['https://picsum.photos/300/200?random=1'],
          inventory: 50,
          seller_id: 'seller1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Organic Cotton T-Shirt',
          description: 'Comfortable organic cotton t-shirt in various colors',
          price: 599,
          category: 'Clothing',
          image_urls: ['https://picsum.photos/300/200?random=2'],
          inventory: 100,
          seller_id: 'seller2',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Smart Home Assistant',
          description: 'Voice-controlled smart home assistant with AI',
          price: 2499,
          category: 'Electronics',
          image_urls: ['https://picsum.photos/300/200?random=3'],
          inventory: 25,
          seller_id: 'seller1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          title: 'Yoga Mat Premium',
          description: 'Non-slip yoga mat perfect for home workouts',
          price: 899,
          category: 'Sports & Outdoors',
          image_urls: ['https://picsum.photos/300/200?random=4'],
          inventory: 75,
          seller_id: 'seller3',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (productId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to cart');
      return;
    }
    // TODO: Implement cart functionality
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketplace</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green-500 focus:border-brand-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={product.image_urls[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.title}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-brand-green-600">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-brand-green-600">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.inventory} in stock
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex-1 bg-brand-green-600 text-white py-2 px-4 rounded-lg hover:bg-brand-green-700 transition-colors"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;