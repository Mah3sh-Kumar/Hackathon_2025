import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../utils/databaseClient';
import { Product } from '../seller/ProductForm';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      if (id) {
        const { data, error } = await db.getProductById(id);
        if (error) throw error;
        setProduct(data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      // For demo, create a mock product
      setProduct({
        id: id || '1',
        title: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with active noise cancellation technology. Features include:\n\n• 30-hour battery life\n• Active noise cancellation\n• Premium sound quality\n• Comfortable over-ear design\n• Built-in microphone\n• Quick charging support\n• Multiple connectivity options',
        price: 1299,
        category: 'Electronics',
        image_urls: [
          'https://picsum.photos/500/400?random=1',
          'https://picsum.photos/500/400?random=2',
          'https://picsum.photos/500/400?random=3',
          'https://picsum.photos/500/400?random=4'
        ],
        inventory: 50,
        seller_id: 'seller1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to cart');
      return;
    }
    // TODO: Implement cart functionality
    alert(`Added ${quantity} ${product?.title} to cart!`);
  };

  const buyNow = () => {
    if (!isAuthenticated) {
      alert('Please sign in to purchase items');
      return;
    }
    // TODO: Implement checkout functionality
    alert('Redirecting to checkout...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/marketplace"
            className="bg-brand-green-600 text-white px-6 py-3 rounded-lg hover:bg-brand-green-700 transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-700 hover:text-brand-green-600">
                <i className="fas fa-home mr-2"></i>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                <Link to="/marketplace" className="text-gray-700 hover:text-brand-green-600">
                  Marketplace
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
                <span className="text-gray-500">{product.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.image_urls[selectedImage] || 'https://via.placeholder.com/500x400?text=No+Image'}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x400?text=No+Image';
                  }}
                />
              </div>
              
              {/* Thumbnail Images */}
              {product.image_urls.length > 1 && (
                <div className="flex space-x-2">
                  {product.image_urls.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-brand-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="fas fa-star"></i>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">(4.8 • 124 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-brand-green-600 mb-6">
                ₹{product.price.toLocaleString()}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <div className="text-gray-600 whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Quantity:</span>
                  <span className="text-sm text-gray-500">
                    {product.inventory} available
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <i className="fas fa-minus text-gray-600"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.inventory}
                    className="w-20 h-10 border border-gray-300 rounded-lg text-center"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <i className="fas fa-plus text-gray-600"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={addToCart}
                  className="w-full bg-brand-green-600 text-white py-3 px-6 rounded-lg hover:bg-brand-green-700 transition-colors font-medium"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Add to Cart
                </button>
                
                <button
                  onClick={buyNow}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  <i className="fas fa-bolt mr-2"></i>
                  Buy Now
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>SKU:</span>
                  <span className="font-medium">SKU-{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <img
                  src={`https://picsum.photos/300/200?random=${i + 10}`}
                  alt={`Related product ${i}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Related Product {i}</h3>
                  <p className="text-brand-green-600 font-bold">₹{(i * 500 + 299).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;