import React from 'react';
import type { Category } from '../types';

const categories: Category[] = [
    { name: 'Vegetables', description: 'Fresh farm produce', imageUrl: 'https://picsum.photos/seed/vegetables/400/250' },
    { name: 'Spices', description: 'Essential masalas', imageUrl: 'https://picsum.photos/seed/spices/400/250' },
    { name: 'Paper Products', description: 'Plates, glasses, utensils', imageUrl: 'https://picsum.photos/seed/paper/400/250' },
    { name: 'Oil & Ghee', description: 'Cooking essentials', imageUrl: 'https://picsum.photos/seed/oils/400/250' },
    { name: 'Beverages', description: 'Drinks and mixes', imageUrl: 'https://picsum.photos/seed/beverages/400/250' },
    { name: 'Packaging', description: 'Containers & boxes', imageUrl: 'https://picsum.photos/seed/packaging/400/250' },
];

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer group">
        <img className="h-40 w-full object-cover" src={category.imageUrl} alt={category.name} />
        <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-green-600 transition-colors">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
        </div>
    </div>
);

const CategoryGrid: React.FC = () => {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-100">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Select a Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(category => (
                        <CategoryCard key={category.name} category={category} />
                    ))}
                </div>
                 <div className="mt-12 text-center">
                    <div className="relative inline-block w-full max-w-md">
                        <input type="text" placeholder="Or search for what you need..." className="w-full pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:border-transparent" />
                        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;