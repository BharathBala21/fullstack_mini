import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user ID and Name from localStorage or default
  const [user, setUser] = useState(() => {
    const savedId = localStorage.getItem('savorcraft_user_id');
    const savedName = localStorage.getItem('savorcraft_user_name');
    if (savedId && savedName) {
      return { id: savedId, name: savedName };
    }
    const newId = 'user_' + Math.random().toString(36).substring(2, 9);
    const newName = 'Chef Foodie';
    localStorage.setItem('savorcraft_user_id', newId);
    localStorage.setItem('savorcraft_user_name', newName);
    return { id: newId, name: newName };
  });

  // Track liked and saved recipe IDs for quick local UI state
  const [savedRecipeIds, setSavedRecipeIds] = useState(() => {
    try {
      const stored = localStorage.getItem('savorcraft_saved_recipes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [likedRecipeIds, setLikedRecipeIds] = useState(() => {
    try {
      const stored = localStorage.getItem('savorcraft_liked_recipes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUserName = (name) => {
    const updated = { ...user, name: name.trim() || 'Chef User' };
    setUser(updated);
    localStorage.setItem('savorcraft_user_name', updated.name);
    showToast(`Display name updated to "${updated.name}"`);
  };

  const toggleLocalSaved = (recipeId, isSaved) => {
    setSavedRecipeIds((prev) => {
      let next;
      if (isSaved) {
        next = prev.includes(recipeId) ? prev : [...prev, recipeId];
      } else {
        next = prev.filter((id) => id !== recipeId);
      }
      localStorage.setItem('savorcraft_saved_recipes', JSON.stringify(next));
      return next;
    });
  };

  const toggleLocalLiked = (recipeId, isLiked) => {
    setLikedRecipeIds((prev) => {
      let next;
      if (isLiked) {
        next = prev.includes(recipeId) ? prev : [...prev, recipeId];
      } else {
        next = prev.filter((id) => id !== recipeId);
      }
      localStorage.setItem('savorcraft_liked_recipes', JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUserName,
        savedRecipeIds,
        likedRecipeIds,
        toggleLocalSaved,
        toggleLocalLiked,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
