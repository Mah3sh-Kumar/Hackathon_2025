import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const NavLink: React.FC<{ href: string; icon?: string; children: React.ReactNode; image?: string }> = ({ href, icon, children, image }) => (
    <li>
        <a href={href} className="flex items-center p-2 text-gray-700 hover:text-brand-green-600 hover:bg-green-50 rounded-md transition-colors duration-200">
            {image ? <img src={image} alt="" className="w-5 h-5 rounded-sm mr-3"/> : (icon && <i className={`${icon} w-5 text-center mr-3 text-gray-500`}></i>)}
            <span className="font-medium">{children}</span>
        </a>
    </li>
);

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const { isAuthenticated, user, isSeller, signOut } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');

    const handleSignIn = () => {
        setAuthModalView('login');
        setShowAuthModal(true);
        onClose(); // Close the side menu when opening auth modal
    };

    const handleSignUp = () => {
        setAuthModalView('signup');
        setShowAuthModal(true);
        onClose(); // Close the side menu when opening auth modal
    };

    const handleSignOut = () => {
        signOut();
        onClose(); // Close the side menu after signing out
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            <aside className={`fixed top-0 left-0 h-full bg-white w-64 p-4 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:shadow-none md:border-r border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h2 className="text-lg font-bold text-brand-green-700">Menu</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>
                
                {/* User profile section */}
                {isAuthenticated ? (
                    <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700">
                                {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <div className="font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleSignOut}
                            className="w-full text-left text-sm text-gray-700 hover:text-brand-green-600 flex items-center p-2 hover:bg-gray-100 rounded-md"
                        >
                            <i className="fas fa-sign-out-alt w-5 text-center mr-3 text-gray-500"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 flex flex-col space-y-2 md:hidden">
                        <button 
                            onClick={handleSignIn}
                            className="bg-brand-green-600 text-white py-2 px-4 rounded-md hover:bg-brand-green-700 transition-colors font-medium flex items-center justify-center"
                        >
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Sign In
                        </button>
                        <button 
                            onClick={handleSignUp}
                            className="border border-brand-green-600 text-brand-green-600 py-2 px-4 rounded-md hover:bg-brand-green-50 transition-colors font-medium flex items-center justify-center"
                        >
                            <i className="fas fa-user-plus mr-2"></i>
                            Register
                        </button>
                    </div>
                )}
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-gray-500 uppercase text-xs font-semibold mb-2 px-2">Your Account</h3>
                        <ul>
                            <NavLink href="/account" icon="fas fa-user-circle">Profile</NavLink>
                            <NavLink href="/orders" icon="fas fa-box-open">Orders</NavLink>
                            <NavLink href="/wishlist" icon="fas fa-heart">Wishlist</NavLink>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-gray-500 uppercase text-xs font-semibold mb-2 px-2">Categories</h3>
                        <ul>
                            <NavLink href="#" image="https://picsum.photos/seed/veg/20/20">Vegetables</NavLink>
                            <NavLink href="#" image="https://picsum.photos/seed/oil/20/20">Oils</NavLink>
                            <NavLink href="#" image="https://picsum.photos/seed/masala/20/20">Masalas</NavLink>
                            <NavLink href="#" image="https://picsum.photos/seed/grain/20/20">Grains</NavLink>
                            <NavLink href="#" image="https://picsum.photos/seed/flour/20/20">Flours</NavLink>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-gray-500 uppercase text-xs font-semibold mb-3 px-2">For Sellers</h3>
                    {isAuthenticated ? (
                        isSeller ? (
                            <a href="/seller/dashboard" className="flex items-center justify-center bg-brand-green-600 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-brand-green-700 transition-colors duration-200">
                                <i className="fas fa-store mr-2"></i> Seller Dashboard
                            </a>
                        ) : (
                            <a href="/become-seller" className="flex items-center justify-center bg-brand-green-100 text-brand-green-800 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-brand-green-200 transition-colors duration-200">
                                <i className="fas fa-store mr-2"></i> Register as Seller
                            </a>
                        )
                    ) : (
                        <button 
                            onClick={handleSignIn}
                            className="flex items-center justify-center w-full bg-brand-green-100 text-brand-green-800 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-brand-green-200 transition-colors duration-200"
                        >
                            <i className="fas fa-sign-in-alt mr-2"></i> Sign in to Register
                        </button>
                    )}
                </div>
            </aside>

            {/* Auth Modal */}
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
                initialView={authModalView}
            />
        </>
    );
};

export default SideMenu;