import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-white py-10 text-stone-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-stone-800">Cookbook</span> — Simple recipe sharing.
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-stone-900 transition">
            Explore
          </Link>
          <Link to="/saved" className="hover:text-stone-900 transition">
            Saved Recipes
          </Link>
          <Link to="/create" className="hover:text-stone-900 transition">
            New Recipe
          </Link>
        </div>

        <div>
          © {new Date().getFullYear()} Cookbook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
