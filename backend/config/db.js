const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const seedRecipes = require('../seed/seedData');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipe_sharing_app';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000, // Quick timeout to fallback if no Mongo running
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);

    // Check if recipes exist, if not seed
    const count = await Recipe.countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Seeding initial recipe collection...');
      await Recipe.insertMany(seedRecipes);
      console.log(`[MongoDB] Seeded ${seedRecipes.length} recipes.`);
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[DB] Notice: MongoDB connection skipped (${error.message}).`);
    console.log(`[DB] Running with high-performance persistent local JSON datastore at backend/data/recipes.json`);
  }
};

const getDBStatus = () => ({
  mode: isMongoConnected ? 'mongodb' : 'json_store',
  connected: isMongoConnected,
});

module.exports = { connectDB, getDBStatus, isMongoConnected: () => isMongoConnected };
