import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  UtensilsCrossed,
  Bookmark,
  BookOpen,
  PlusCircle,
  User,
  Menu,
  X,
  Edit2,
  Check,
} from 'lucide-react';

const Navbar = () => {
  const { user, updateUserName, savedRecipeIds } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
      setIsEditingUser(false);
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-semibold transition px-3 py-2 rounded-lg ${
      isActive
        ? 'text-brand-600 bg-brand-50'
        : 'text-stone-600 hover:text-brand-600 hover:bg-stone-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 group-hover:text-brand-600 transition">
              SavorCraft
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
              Recipes
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" end className={navLinkClasses}>
            <BookOpen className="w-4 h-4" />
            <span>Explore</span>
          </NavLink>

          <NavLink to="/saved" className={navLinkClasses}>
            <Bookmark className="w-4 h-4" />
            <span>Saved Recipes</span>
            {savedRecipeIds.length > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-1.5 py-0.2 rounded-full min-w-[20px] text-center">
                {savedRecipeIds.length}
              </span>
            )}
          </NavLink>

          <NavLink to="/my-recipes" className={navLinkClasses}>
            <User className="w-4 h-4" />
            <span>My Recipes</span>
          </NavLink>
        </nav>

        {/* User Identity & CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* User profile capsule */}
          <div className="relative">
            {isEditingUser ? (
              <form
                onSubmit={handleSaveName}
                className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-300"
              >
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-transparent text-xs font-semibold px-2 py-1 text-stone-800 focus:outline-none w-28"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 bg-brand-600 text-white rounded hover:bg-brand-700"
                  title="Save Name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingUser(false)}
                  className="p-1 text-stone-500 hover:text-stone-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setNameInput(user.name);
                  setIsEditingUser(true);
                }}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-stone-200 transition group"
                title="Click to edit your display name"
              >
                <div className="w-5 h-5 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
                <Edit2 className="w-3 h-3 text-stone-400 group-hover:text-stone-700" />
              </button>
            )}
          </div>

          {/* Publish Recipe Button */}
          <Link
            to="/create"
            className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-brand-500/25 transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Recipe</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/create"
            className="p-2 bg-brand-500 text-white rounded-lg shadow-sm"
            aria-label="Create Recipe"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-stone-800">{user.name}</span>
            </div>
            <button
              onClick={() => {
                const newName = prompt('Enter new display name:', user.name);
                if (newName) updateUserName(newName);
              }}
              className="text-xs text-brand-600 font-medium hover:underline"
            >
              Change Name
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Recipes</span>
            </NavLink>

            <NavLink
              to="/saved"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Recipes ({savedRecipeIds.length})</span>
            </NavLink>

            <NavLink
              to="/my-recipes"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <User className="w-4 h-4" />
              <span>My Recipes</span>
            </NavLink>
          </div>

          <div className="pt-2">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish a Recipe</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
