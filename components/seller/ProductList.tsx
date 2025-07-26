import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from './ProductForm';

type ProductListProps = {
  products: Product[];
  onDelete: (productId: string) => void;
};

const ProductList: React.FC<ProductListProps> = ({ products, onDelete }) => {
  const navigate = useNavigate();
  
  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mb-4 text-gray-400">
          <i className="fas fa-box-open text-5xl"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
        <p className="text-gray-500 mb-6">You haven't added any products yet.</p>
        <Link
          to="/seller/products/new"
          className="bg-brand-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-700 transition-colors"
        >
          Add Your First Product
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Your Products</h3>
        <Link
          to="/seller/products/new"
          className="bg-brand-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-green-700 transition-colors flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Add New Product
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Inventory</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {product.image_urls && product.image_urls.length > 0 ? (
                        <img 
                          className="h-10 w-10 object-cover rounded-md" 
                          src={product.image_urls[0]} 
                          alt={product.title} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${
                    product.inventory > 10 
                      ? 'text-green-600' 
                      : product.inventory > 0 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {product.inventory} units
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this product?')) {
                          onDelete(product.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;