import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import EditRecipe from './pages/EditRecipe';
import SavedRecipes from './pages/SavedRecipes';
import MyRecipes from './pages/MyRecipes';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/recipes/:id/edit" element={<EditRecipe />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/saved" element={<SavedRecipes />} />
              <Route path="/my-recipes" element={<MyRecipes />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <Toast />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
