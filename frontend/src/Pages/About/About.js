import React from 'react';
import { Home, Users, ShoppingCart, Clock, Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '../Header/Header';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Platform Overview */}
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold text-cyan-600 mb-6">About Our Platform</h2>
          
          <div className="bg-cyan-50 rounded-lg p-6 shadow-md">
            <p className="text-lg leading-relaxed mb-6">
              BidMaster is an innovative e-commerce platform that revolutionizes online auctions 
              by providing a dynamic, transparent, and user-friendly bidding experience. 
              Our mission is to connect buyers and sellers through an intuitive auction marketplace.
            </p>

            {/* Platform Features */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Buyers Section */}
              <div>
                <h3 className="text-2xl font-bold text-cyan-600 mb-4 flex items-center">
                  <ShoppingCart className="mr-3 text-cyan-500" />
                  For Buyers
                </h3>
                <ul className="space-y-2 pl-4 border-l-4 border-cyan-500">
                  <li>Browse multiple product categories</li>
                  <li>Place competitive bids in real-time</li>
                  <li>Track auction progress</li>
                  <li>Win products through highest bidding</li>
                </ul>
              </div>

              {/* Sellers Section */}
              <div>
                <h3 className="text-2xl font-bold text-cyan-600 mb-4 flex items-center">
                  <Users className="mr-3 text-cyan-500" />
                  For Sellers
                </h3>
                <ul className="space-y-2 pl-4 border-l-4 border-cyan-500">
                  <li>List products for auction</li>
                  <li>Set initial bid prices</li>
                  <li>Define auction duration</li>
                  <li>Reach multiple potential buyers</li>
                </ul>
              </div>
            </div>

            {/* Auction Process */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold text-cyan-600 mb-4 flex items-center">
                <Clock className="mr-3 text-cyan-500" />
                Auction Process
              </h3>
              <p className="text-lg">
                Each auction runs for a set duration. When the timer ends, the highest bidder wins the product. 
                Our platform ensures a fair, transparent, and exciting bidding experience for all participants.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="max-w-4xl mx-auto bg-cyan-50 rounded-lg p-8 shadow-md">
          <h2 className="text-3xl font-semibold text-cyan-600 mb-6">Contact Us</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Details */}
            <div>
              <h3 className="text-xl font-bold text-cyan-600 mb-4 flex items-center">
                <Home className="mr-3 text-cyan-500" />
                Company Details
              </h3>
              <div className="space-y-2">
                <p>BidMaster Technologies Inc.</p>
                <p>123 Auction Street</p>
                <p>Silicon Valley, CA 94000</p>
                <p>United States</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold text-cyan-600 mb-4 flex items-center">
                <Phone className="mr-3 text-cyan-500" />
                Contact Information
              </h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Mail className="mr-2 text-cyan-500" /> support@bidmaster.com
                </p>
                <p className="flex items-center">
                  <Phone className="mr-2 text-cyan-500" /> +1 (555) 123-4567
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 text-cyan-500" /> Mon-Fri, 9 AM - 6 PM PST
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-cyan-500 text-white text-center py-4">
        <p>&copy; 2025 BidMaster Technologies Inc. All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default AboutPage;