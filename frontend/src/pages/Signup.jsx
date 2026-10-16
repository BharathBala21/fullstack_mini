import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Utensils, ArrowRight, UserCheck } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { user, signup, logout } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoggedIn = user && user.id !== 'user_guest';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    signup(name.trim(), email.trim());
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-stone-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-stone-500">
            Sign up to share recipes and build your personal cookbook.
          </p>
        </div>

        {isLoggedIn ? (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-stone-900 font-semibold text-sm">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Signed in as {user.name}</span>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition"
              >
                Go to Recipes
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-3 py-2 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 text-xs font-semibold rounded-lg transition"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name / Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Baker"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@example.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="text-center space-y-2 pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="text-stone-900 font-semibold underline">
              Sign in
            </Link>
          </p>
          <div>
            <Link
              to="/"
              className="text-xs text-stone-400 hover:text-stone-700 font-medium"
            >
              Back to recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
