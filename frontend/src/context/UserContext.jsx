import React, { createContext, useContext, useState } from 'react';
import { STORAGE_KEYS, DEFAULT_USER } from '../config/constants';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    if (savedId && savedName) {
      return { id: savedId, name: savedName };
    }
    const newId = 'user_' + Math.random().toString(36).substring(2, 9);
    const newName = DEFAULT_USER.NAME;
    localStorage.setItem(STORAGE_KEYS.USER_ID, newId);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, newName);
    return { id: newId, name: newName };
  });

  const [savedRecipeIds, setSavedRecipeIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [likedRecipeIds, setLikedRecipeIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKED_RECIPES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUserName = (name) => {
    const cleanName = name.trim() || DEFAULT_USER.NAME;
    const updated = { ...user, name: cleanName };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, cleanName);
    showToast(`Name updated to ${cleanName}`);
  };

  const toggleLocalSaved = (recipeId, isSaved) => {
    setSavedRecipeIds((prev) => {
      let next;
      if (isSaved) {
        next = prev.includes(recipeId) ? prev : [...prev, recipeId];
      } else {
        next = prev.filter((id) => id !== recipeId);
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(next));
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
      localStorage.setItem(STORAGE_KEYS.LIKED_RECIPES, JSON.stringify(next));
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
