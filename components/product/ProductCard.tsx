import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../components/seller/ProductForm';
import { useAuth } from '../../hooks/useAuth';

type ProductCardProps = {
  product: Product;
  showActions?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, showActions = true }) => {
  const { user } = useAuth();
  
  // Format price with Indian Rupee symbol
  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;
  
  // Calculate discount percentage if original price is available
  // This is a placeholder for future enhancement
  const discountPercentage = 0;
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  // Determine inventory status
  const getInventoryStatus = () => {
    if (product.inventory <= 0) {
      return { text: 'Out of Stock', class: 'bg-red-100 text-red-800' };
    }
    if (product.inventory <= 5) {
      return { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'In Stock', class: 'bg-green-100 text-green-800' };
  };
  
  const inventoryStatus = getInventoryStatus();
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 transition-all hover:shadow-md">
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block relative h-48 overflow-hidden">
        {product.image_urls && product.image_urls.length > 0 ? (
          <img 
            src={product.image_urls[0]} 
            alt={product.title}
            className="object-cover object-center w-full h-full transition-transform hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Product+Image";
            }}
          />
        ) : (
          <div className="bg-gray-200 flex items-center justify-center w-full h-full">
            <i className="fas fa-image text-gray-400 text-4xl"></i>
          </div>
        )}
        
        {/* Inventory Badge */}
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${inventoryStatus.class}`}>
          {inventoryStatus.text}
        </span>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 hover:text-brand-green-600">
          <Link to={`/product/${product.id}`}>
            {truncateText(product.title, 50)}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {truncateText(product.description, 100)}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center mb-3">
          <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
          
          {discountPercentage > 0 && (
            <>
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{(product.price / (1 - discountPercentage/100)).toFixed(2)}
              </span>
              <span className="text-xs text-green-600 ml-2">
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>
        
        {/* Category Badge */}
        <div className="mb-3">
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {product.category}
          </span>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            <Link 
              to={`/product/${product.id}`}
              className="flex-1 py-2 bg-brand-green-600 text-white text-center rounded-md hover:bg-brand-green-700 transition-colors"
            >
              View Details
            </Link>
            <button 
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => {
                // Add to cart functionality will be implemented here
                alert('Added to cart!');
              }}
            >
              <i className="fas fa-shopping-cart"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;