const fs = require('fs');
const path = require('path');
const seedRecipes = require('../seed/seedData');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'recipes.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = seedRecipes.map((r, idx) => ({
      ...r,
      _id: `rec_${Date.now()}_${idx + 1}`,
      createdAt: new Date(Date.now() - (6 - idx) * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - (6 - idx) * 3600000).toISOString(),
    }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readAll() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading recipes file:', e);
    return [];
  }
}

function writeAll(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const fileStore = {
  isFallback: true,

  async find(query = {}) {
    let list = readAll();

    // Search filter across title, category, and ingredients
    if (query.search) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          r.category.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
      );
    }

    // Specific ingredient filter
    if (query.ingredient) {
      const ing = query.ingredient.toLowerCase().trim();
      list = list.filter((r) =>
        r.ingredients.some((i) => i.name.toLowerCase().includes(ing))
      );
    }

    // Category filter
    if (query.category && query.category !== 'All') {
      list = list.filter(
        (r) => r.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    // Difficulty filter
    if (query.difficulty && query.difficulty !== 'All') {
      list = list.filter(
        (r) => r.difficulty.toLowerCase() === query.difficulty.toLowerCase()
      );
    }

    // Author filter
    if (query.authorId) {
      list = list.filter((r) => r.author && r.author.id === query.authorId);
    }

    // SavedBy filter
    if (query.savedBy) {
      list = list.filter(
        (r) => Array.isArray(r.savedBy) && r.savedBy.includes(query.savedBy)
      );
    }

    // Max cooking time filter
    if (query.maxTime) {
      const max = Number(query.maxTime);
      if (!isNaN(max) && max > 0) {
        list = list.filter((r) => r.cookingTime <= max);
      }
    }

    // Sorting
    const { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER, DEFAULT_SORT_OPTION } = require('../config/constants');
    const sort = query.sort || DEFAULT_SORT_OPTION;
    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'likes') {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sort === 'cookingTime') {
      list.sort((a, b) => a.cookingTime - b.cookingTime);
    }

    const total = list.length;
    const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE_NUMBER);
    const limit = Math.max(1, parseInt(query.limit) || DEFAULT_PAGE_SIZE);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      recipes: paginated,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    };
  },

  async findById(id) {
    const list = readAll();
    return list.find((r) => String(r._id) === String(id)) || null;
  },

  async create(recipeData) {
    const list = readAll();
    const newRecipe = {
      ...recipeData,
      _id: `rec_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      likes: recipeData.likes || 0,
      likedBy: recipeData.likedBy || [],
      savedBy: recipeData.savedBy || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newRecipe);
    writeAll(list);
    return newRecipe;
  },

  async findByIdAndUpdate(id, updateData) {
    const list = readAll();
    const index = list.findIndex((r) => String(r._id) === String(id));
    if (index === -1) return null;

    const existing = list[index];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    writeAll(list);
    return updated;
  },

  async findByIdAndDelete(id) {
    const list = readAll();
    const index = list.findIndex((r) => String(r._id) === String(id));
    if (index === -1) return null;
    const deleted = list.splice(index, 1)[0];
    writeAll(list);
    return deleted;
  },

  async getCategories() {
    const list = readAll();
    const set = new Set();
    list.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  },
};

module.exports = fileStore;
