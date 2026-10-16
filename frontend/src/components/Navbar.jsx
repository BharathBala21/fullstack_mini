import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Utensils, Plus, Menu, X, LogIn, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, savedRecipeIds } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = user && user.id !== 'user_guest';

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
      isActive
        ? 'text-stone-900 bg-stone-100 font-semibold'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-stone-900 font-semibold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <span>Cookbook</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Explore
            </NavLink>

            <NavLink to="/saved" className={navLinkClass}>
              Saved
              {savedRecipeIds.length > 0 && (
                <span className="ml-1.5 text-xs bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded-full font-medium">
                  {savedRecipeIds.length}
                </span>
              )}
            </NavLink>

            <NavLink to="/my-recipes" className={navLinkClass}>
              My Recipes
            </NavLink>
          </nav>
        </div>

        {/* User profile & Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-stone-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-semibold text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-stone-500 hover:text-rose-600 px-2 py-1 rounded hover:bg-stone-50 transition"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-xs text-stone-700 hover:text-stone-900 font-medium px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in</span>
            </Link>
          )}

          <Link
            to="/create"
            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Recipe</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/create"
            className="p-2 bg-stone-900 text-white rounded-lg text-xs"
            aria-label="New Recipe"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs text-stone-600">
            {isLoggedIn ? (
              <>
                <span>Signed in as <strong className="text-stone-900">{user.name}</strong></span>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-rose-600 font-medium underline"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-stone-900 font-semibold underline flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium py-1.5 text-stone-700"
          >
            Explore
          </NavLink>
          <NavLink
            to="/saved"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium py-1.5 text-stone-700"
          >
            Saved Recipes ({savedRecipeIds.length})
          </NavLink>
          <NavLink
            to="/my-recipes"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium py-1.5 text-stone-700"
          >
            My Recipes
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
