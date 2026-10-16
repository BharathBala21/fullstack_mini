import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Utensils, ArrowRight, UserCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isLoggedIn = user && user.id !== 'user_guest';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    login(username.trim());
    navigate('/');
  };

  const handleDemoLogin = () => {
    login('Alex');
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
            Sign in to Cookbook
          </h1>
          <p className="text-xs text-stone-500">
            Enter your name to publish recipes, save favorites, and like dishes.
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
                Your Name / Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-stone-400 font-medium">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition"
            >
              Quick Demo Sign In (Alex)
            </button>
          </form>
        )}

        <div className="text-center space-y-2 pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-stone-900 font-semibold underline">
              Sign up
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

export default Login;
