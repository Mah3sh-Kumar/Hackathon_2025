import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Define product type
export type Product = {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image_urls: string[];
  created_at: string;
  updated_at: string;
};

type ProductFormProps = {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'seller_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
};

// List of available categories
const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Books',
  'Sports & Outdoors',
  'Toys & Games',
  'Health & Wellness',
  'Automotive',
  'Others',
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || 'Electronics');
  const [inventory, setInventory] = useState(product?.inventory?.toString() || '');
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls || ['']);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Add new image URL field
  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  // Remove image URL field
  const removeImageUrl = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
  };

  // Update specific image URL
  const updateImageUrl = (index: number, value: string) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  // Handle image file upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, create a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateImageUrl(index, result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!title.trim()) errors.title = 'Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!price.trim()) errors.price = 'Price is required';
    else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) 
      errors.price = 'Price must be a positive number';
    if (!inventory.trim()) errors.inventory = 'Inventory is required';
    else if (isNaN(parseInt(inventory)) || parseInt(inventory) < 0) 
      errors.inventory = 'Inventory must be a non-negative number';
    if (!imageUrls[0].trim()) errors.imageUrl = 'At least one image URL is required';
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const filteredImageUrls = imageUrls.filter(url => url.trim() !== '');
    
    onSubmit({
      title,
      description,
      price: parseFloat(price),
      category,
      inventory: parseInt(inventory),
      image_urls: filteredImageUrls,
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {product ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Title*</label>
          <input 
            type="text" 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500 ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter product title"
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description*</label>
          <textarea 
            className={`w-full px-4 py-2 border rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500 ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product"
            rows={4}
          ></textarea>
          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
          )}
        </div>
        
        {/* Price and Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Price (₹)*</label>
            <input 
              type="text" 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500 ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Inventory*</label>
            <input 
              type="text" 
              className={`w-full px-4 py-2 border rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500 ${formErrors.inventory ? 'border-red-500' : 'border-gray-300'}`}
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              placeholder="0"
            />
            {formErrors.inventory && (
              <p className="text-red-500 text-sm mt-1">{formErrors.inventory}</p>
            )}
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category*</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        {/* Image URLs */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Product Images*
            <span className="text-sm text-gray-500 ml-2">(Enter URLs or upload files)</span>
          </label>
          
          {imageUrls.map((url, index) => (
            <div key={index} className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  className={`flex-grow px-4 py-2 border rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500 ${index === 0 && formErrors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="Image URL or upload file"
                />
                <label className="cursor-pointer bg-brand-green-600 text-white px-3 py-2 rounded-lg hover:bg-brand-green-700 transition-colors">
                  <i className="fas fa-upload mr-1"></i>
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, index)}
                    className="hidden"
                  />
                </label>
                <button 
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700"
                  disabled={imageUrls.length === 1 && index === 0}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              {url && (
                <div className="w-32 h-24 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x96?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
          
          {imageUrls.length === 0 && formErrors.imageUrl && (
            <p className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>
          )}
          
          <button 
            type="button"
            onClick={addImageUrl}
            className="mt-2 text-brand-green-600 hover:text-brand-green-700 text-sm font-semibold"
          >
            <i className="fas fa-plus mr-1"></i> Add Another Image
          </button>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 transition-colors"
          >
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;