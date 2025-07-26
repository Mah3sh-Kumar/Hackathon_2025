import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    const { isAuthenticated, user, isSeller, signOut } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');

    const handleSignIn = () => {
        setAuthModalView('login');
        setShowAuthModal(true);
    };

    const handleSignUp = () => {
        setAuthModalView('signup');
        setShowAuthModal(true);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and brand name */}
                    <div className="flex items-center">
                        <button onClick={onMenuToggle} className="md:hidden mr-3 text-gray-500 hover:text-brand-green-600" aria-label="Toggle menu">
                            <i className="fas fa-bars fa-lg"></i>
                        </button>
                        <Link to="/" className="flex items-center">
                            <img src="https://picsum.photos/seed/logo/50/50" alt="BazaarLink logo" className="h-8 w-8 rounded-full object-cover"/>
                            <h1 className="text-xl font-bold text-brand-green-700 ml-2">BazaarLink</h1>
                        </Link>
                    </div>
                    
                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-8 ml-8">
                        <Link to="/" className="text-gray-700 hover:text-brand-green-600 font-medium">Home</Link>
                        <Link to="/marketplace" className="text-gray-700 hover:text-brand-green-600 font-medium">Marketplace</Link>
                        <Link to="/wholesale" className="text-gray-700 hover:text-brand-green-600 font-medium">Wholesale</Link>
                        <a href="#categories" className="text-gray-700 hover:text-brand-green-600 font-medium">Categories</a>
                    </nav>
                    
                    
                    {/* Action buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center">
                                {/* Seller Dashboard Link */}
                                {isSeller && (
                                    <Link 
                                        to="/seller/dashboard"
                                        className="bg-brand-green-600 text-white px-4 py-2 rounded-lg hover:bg-brand-green-700 mr-6 font-medium"
                                    >
                                        <i className="fas fa-store mr-2"></i>
                                        Seller Dashboard
                                    </Link>
                                )}
                                {!isSeller && (
                                    <Link 
                                        to="/become-seller"
                                        className="bg-brand-green-600 text-white px-4 py-2 rounded-lg hover:bg-brand-green-700 mr-6 font-medium"
                                    >
                                        <i className="fas fa-store mr-2"></i>
                                        Become a Seller
                                    </Link>
                                )}
                                
                                {/* User dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 group-hover:text-brand-green-600">
                                        <div className="h-8 w-8 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700">
                                            {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <span className="font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                                        <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700">
                                            <i className="fas fa-user mr-2"></i> My Account
                                        </Link>
                                        <Link to="/dashboard/orders" className="block px-4 py-2 text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700">
                                            <i className="fas fa-box mr-2"></i> My Orders
                                        </Link>
                                        {isSeller ? (
                                            <Link to="/seller/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700">
                                                <i className="fas fa-store mr-2"></i> Seller Dashboard
                                            </Link>
                                        ) : (
                                            <Link to="/become-seller" className="block px-4 py-2 text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700">
                                                <i className="fas fa-store mr-2"></i> Become a Seller
                                            </Link>
                                        )}
                                        <button 
                                            onClick={signOut}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700"
                                        >
                                            <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={handleSignIn}
                                    className="bg-brand-green-600 text-white px-5 py-2 rounded-full hover:bg-brand-green-700 transition font-semibold text-sm"
                                >
                                    Sign In
                                </button>
                                <button 
                                    onClick={handleSignUp}
                                    className="text-brand-green-600 hover:text-brand-green-700 font-semibold text-sm"
                                >
                                    Register
                                </button>
                            </>
                        )}
                        
                        <Link to={isAuthenticated ? "/dashboard/cart" : "#"} onClick={!isAuthenticated ? handleSignIn : undefined} className="relative cursor-pointer group">
                            <i className="fas fa-shopping-cart text-2xl text-gray-600 group-hover:text-brand-green-600 transition"></i>
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">0</span>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Announcement bar */}
            <div className="bg-brand-green-700 text-white py-2 px-4">
                <div className="container mx-auto">
                    <p className="text-center text-sm">
                        <i className="fas fa-truck mr-2"></i> Free delivery on bulk orders over ₹2000 | <span className="font-semibold">20+ cities served</span>
                    </p>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
                initialView={authModalView}
            />
        </header>
    );
};

export default Header;