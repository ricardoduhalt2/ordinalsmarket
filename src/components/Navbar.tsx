import React from 'react';
import { Link } from 'react-router-dom';
const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-700 p-4 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-semibold tracking-wide">Wealth Protocol</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-yellow-400 transition duration-300">Home</Link>
          <Link to="/about" className="text-white hover:text-yellow-400 transition duration-300">About</Link>
          <Link to="/contact" className="text-white hover:text-yellow-400 transition duration-300">Contact</Link>
          <Link to="/ordinals" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            ORDINALS
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
