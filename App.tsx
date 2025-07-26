import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import WholesalerSection from './components/WholesalerSection';
import Footer from './components/Footer';

const App: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="font-sans bg-slate-50 text-gray-800">
            <Header onMenuToggle={() => setIsMenuOpen(true)} />

            <div className="flex">
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
                
                <main className="flex-1 md:ml-64 min-h-screen transition-all duration-300">
                    <HeroSection />
                    <CategoryGrid />
                    <WholesalerSection />
                    <Footer />
                </main>
            </div>
             {/* Mobile Menu Toggle Button */}
             <div className="md:hidden fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="bg-brand-green-600 text-white p-4 rounded-full shadow-lg hover:bg-brand-green-700 transition-transform duration-300 ease-in-out transform hover:scale-110"
                    aria-label="Open menu"
                >
                    <i className="fas fa-bars fa-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default App;