import React from 'react';
import { UtensilsCrossed, Heart, Code2, Database, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                SavorCraft
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              A modern, full-stack recipe sharing platform built for culinary creators.
              Publish signature recipes, explore world cuisines, search by ingredients,
              and curate personal cookbooks with instant likes and bookmarks.
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700">
                <Code2 className="w-3.5 h-3.5 text-brand-400" /> React 18 & Vite
              </span>
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Express & MongoDB
              </span>
              <span className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Multer Uploads
              </span>
            </div>
          </div>

          {/* REST API Endpoints Quick Ref */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              REST API Contract
            </h4>
            <ul className="space-y-1.5 text-xs font-mono text-stone-400">
              <li className="flex items-center justify-between">
                <span className="text-emerald-400">GET</span> /api/recipes?search=
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sky-400">POST</span> /api/recipes
              </li>
              <li className="flex items-center justify-between">
                <span className="text-emerald-400">GET</span> /api/recipes/:id
              </li>
              <li className="flex items-center justify-between">
                <span className="text-amber-400">PUT</span> /api/recipes/:id
              </li>
              <li className="flex items-center justify-between">
                <span className="text-rose-400">POST</span> /api/recipes/:id/like
              </li>
              <li className="flex items-center justify-between">
                <span className="text-purple-400">POST</span> /api/recipes/:id/save
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Categories
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-400">
              {['Dinner', 'Lunch', 'Breakfast', 'Dessert', 'Vegetarian', 'Snack', 'Appetizer'].map(
                (cat) => (
                  <span
                    key={cat}
                    className="bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded cursor-pointer transition"
                  >
                    {cat}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 SavorCraft Recipe App. Built with precision and care.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for delicious cooking
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
