import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                            Bulk Buying, Simplified for <span className="text-brand-green-600">Street Food Vendors</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                            Source directly from wholesalers at prices 15-20% lower than market rates. Free delivery on bulk orders across Chennai, Mumbai & Delhi.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                            <button className="bg-brand-green-600 text-white px-8 py-3 rounded-lg hover:bg-brand-green-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-1 font-semibold text-lg">
                                Start Shopping
                            </button>
                            <button className="border-2 border-brand-green-600 text-brand-green-600 px-8 py-3 rounded-lg hover:bg-brand-green-50 transition font-semibold text-lg">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <img src="https://picsum.photos/seed/vendor/600/400" alt="Happy street food vendor preparing dishes with fresh ingredients" className="rounded-lg shadow-xl w-full h-auto object-cover"/>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;