import React, { useState } from 'react';

type SearchFiltersProps = {
  categories: string[];
  selectedCategory: string | null;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  sortBy: 'price_asc' | 'price_desc' | 'newest';
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onSortChange: (value: 'price_asc' | 'price_desc' | 'newest') => void;
};

const SearchFilters: React.FC<SearchFiltersProps> = ({
  categories,
  selectedCategory,
  priceRange,
  minPrice,
  maxPrice,
  sortBy,
  searchQuery,
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onSortChange
}) => {
  const [localMinPrice, setLocalMinPrice] = useState(priceRange[0].toString());
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange[1].toString());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value);
  };

  const applyPriceFilter = () => {
    const min = parseFloat(localMinPrice) || minPrice;
    const max = parseFloat(localMaxPrice) || maxPrice;
    onPriceRangeChange([Math.min(min, max), Math.max(min, max)]);
  };

  const handlePriceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyPriceFilter();
    }
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onPriceRangeChange([minPrice, maxPrice]);
    onSortChange('newest');
    setLocalMinPrice(minPrice.toString());
    setLocalMaxPrice(maxPrice.toString());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile filters button */}
      <div className="md:hidden p-4 border-b border-gray-200">
        <button 
          className="w-full flex items-center justify-between py-2 px-4 bg-gray-100 rounded-md text-gray-700"
          onClick={toggleMobileFilters}
        >
          <span className="font-medium">Filters</span>
          <i className={`fas fa-chevron-${isMobileFiltersOpen ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {/* Filters content - hidden on mobile unless expanded */}
      <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Search</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="category-all"
                className="mr-2 text-brand-green-600 focus:ring-brand-green-500"
                checked={selectedCategory === null}
                onChange={() => onCategoryChange(null)}
              />
              <label htmlFor="category-all" className="text-gray-700 cursor-pointer">All Categories</label>
            </div>
            
            {categories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  id={`category-${category}`}
                  className="mr-2 text-brand-green-600 focus:ring-brand-green-500"
                  checked={selectedCategory === category}
                  onChange={() => onCategoryChange(category)}
                />
                <label htmlFor={`category-${category}`} className="text-gray-700 cursor-pointer">{category}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Min</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                  value={localMinPrice}
                  onChange={handleMinPriceChange}
                  onBlur={applyPriceFilter}
                  onKeyPress={handlePriceKeyPress}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Max</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                <input
                  type="number"
                  className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
                  value={localMaxPrice}
                  onChange={handleMaxPriceChange}
                  onBlur={applyPriceFilter}
                  onKeyPress={handlePriceKeyPress}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-green-500 focus:border-brand-green-500"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'price_asc' | 'price_desc' | 'newest')}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="p-4">
          <button
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;