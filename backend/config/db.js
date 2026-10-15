const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const seedRecipes = require('../seed/seedData');
const { DEFAULT_MONGO_URI } = require('./constants');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);

    const count = await Recipe.countDocuments();
    if (count === 0) {
      console.log('[MongoDB] Seeding initial recipe collection...');
      await Recipe.insertMany(seedRecipes);
      console.log(`[MongoDB] Seeded ${seedRecipes.length} recipes.`);
    }
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[DB] Notice: MongoDB connection skipped (${error.message}).`);
    console.log(`[DB] Using persistent JSON datastore at backend/data/recipes.json`);
  }
};

const getDBStatus = () => ({
  mode: isMongoConnected ? 'mongodb' : 'json_store',
  connected: isMongoConnected,
});

module.exports = { connectDB, getDBStatus, isMongoConnected: () => isMongoConnected };
