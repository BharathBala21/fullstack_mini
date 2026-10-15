# 🍳 SavorCraft — Recipe Sharing Platform

A full-stack culinary web application where users can publish original recipes with nested ingredients and preparation steps, browse community dishes, search by ingredient in their pantry, like and bookmark recipes into personal cookbooks, and upload cover photos with Multer.

---

## 📌 Project Overview

This application fulfills all requirements of **Project 4: Recipe Sharing App** and implements the full **One-Week Plan CUBRICS** curriculum:

- **Day 1**: Define features, MongoDB schemas, and REST endpoint contracts.
- **Day 2**: Build Express server, database connection (with MongoDB & fallback store), and JSON APIs.
- **Day 3**: Build React pages, forms, dynamic arrays, and API calls with Axios.
- **Day 4**: Complete full CRUD flows, nested document validation, loading & error states.
- **Day 5**: Automated API testing, bug fixes, complete documentation, and production readiness.

---

## 🚀 Key Features

1. **Recipe Discovery & Search**:
   - **General Search**: Full-text search matching titles, descriptions, categories, and ingredients (`GET /api/recipes?search=`).
   - **Ingredient Search**: Dedicated filter matching recipes that contain specific pantry ingredients (`GET /api/recipes?ingredient=garlic`).
   - **Category Pills**: Filter by Breakfast, Lunch, Dinner, Dessert, Vegetarian, Snack, Drink, etc.
   - **Cook Time Slider**: Find quick meals under 15, 30, or 60 minutes.
   - **Sorting**: Sort by Newest, Most Liked, Cooking Time, or Oldest.
   - **Pagination**: Server-side pagination with page numbers and limits.

2. **Publish & Edit Recipes (CRUD)**:
   - **Dynamic Ingredients Array**: Add/remove/edit ingredient rows with Name, Amount, and Unit.
   - **Dynamic Steps Array**: Add/remove/reorder ordered preparation instructions with auto-renumbering.
   - **Cover Photo Uploads**: Multi-mode uploader supporting **Multer** disk file uploads (JPEG, PNG, WEBP) or direct image URLs with live preview and photo presets.
   - **Update & Delete**: In-place editing (`PUT /api/recipes/:id`) and deletion with modal confirmation (`DELETE /api/recipes/:id`).

3. **Interactive Cooking Experience**:
   - **Real-time Servings Scaler**: Increase or decrease servings (`+` / `-`) on the detail page to automatically recalculate and scale all ingredient amounts dynamically.
   - **Interactive Ingredients Checklist**: Tap or click ingredients to cross them off while cooking in the kitchen.
   - **Step Progress Tracker**: Check off completed instructions as you cook with progress indicators.

4. **Community & Cookbook Features**:
   - **Like System**: One-click like toggling with persistent user tracking (`POST /api/recipes/:id/like`).
   - **Personal Saved Cookbook**: Bookmark recipes (`POST /api/recipes/:id/save`) and access them anytime in the **Saved Recipes** tab.
   - **Chef Dashboard**: View all recipes you published in the **My Recipes** tab.
   - **Customizable Chef Display Name**: Edit your chef profile name directly from the navigation bar.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express 4, Mongoose 8, Multer (file uploads), Morgan, Cors, Dotenv.
- **Database**: MongoDB with Mongoose Schema. Includes an automatic persistent fallback datastore (`backend/data/recipes.json`) ensuring 100% out-of-the-box operation even if local MongoDB is not running.
- **Testing**: End-to-end automated HTTP test suite (`test-api.js`).

---

## 📄 REST API Specification

| Method | Endpoint | Description | Query / Body Parameters |
|---|---|---|---|
| `GET` | `/api/recipes` | Fetch paginated recipes with filters | `?search=`, `?ingredient=`, `?category=`, `?difficulty=`, `?maxTime=`, `?sort=`, `?page=`, `?limit=`, `?authorId=`, `?savedBy=` |
| `POST` | `/api/recipes` | Publish a new recipe | Supports JSON body or `multipart/form-data` with `image` file |
| `GET` | `/api/recipes/:id` | Get single recipe details | `:id` (Recipe ID) |
| `PUT` | `/api/recipes/:id` | Update an existing recipe | `:id` (Recipe ID) + updated fields |
| `DELETE` | `/api/recipes/:id` | Delete a recipe | `:id` (Recipe ID) |
| `POST` | `/api/recipes/:id/like` | Toggle like for a user | Body: `{ userId: "user_123" }` |
| `POST` | `/api/recipes/:id/save` | Toggle save/bookmark for a user | Body: `{ userId: "user_123" }` |
| `GET` | `/api/recipes/categories` | Get available categories | None |
| `POST` | `/api/upload` | Upload image file using Multer | Form-data with key `image` |
| `GET` | `/api/health` | Health check & DB status | None |

---

## 📊 JSON Data Model (Mongoose Schema)

```json
{
  "_id": "67b001a1e0b57e0012345678",
  "title": "Creamy Tuscan Garlic Chicken",
  "description": "Pan-seared chicken breasts smothered in a rich garlic sun-dried tomato cream sauce.",
  "category": "Dinner",
  "difficulty": "Medium",
  "cookingTime": 30,
  "prepTime": 15,
  "servings": 4,
  "imageUrl": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  "author": {
    "name": "Chef Isabella Rossi",
    "id": "chef_isabella"
  },
  "likes": 24,
  "likedBy": ["user_1", "user_2"],
  "savedBy": ["user_1"],
  "ingredients": [
    { "name": "Boneless chicken breast", "amount": "2", "unit": "large breasts" },
    { "name": "Heavy cream", "amount": "1", "unit": "cup" },
    { "name": "Garlic", "amount": "4", "unit": "cloves minced" }
  ],
  "steps": [
    { "stepNumber": 1, "instruction": "Season chicken breasts generously with salt and pepper." },
    { "stepNumber": 2, "instruction": "Sear chicken in olive oil for 5-6 minutes per side." }
  ],
  "createdAt": "2026-10-15T18:00:00.000Z",
  "updatedAt": "2026-10-15T18:00:00.000Z"
}
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v26)
- **npm** v9+
- *(Optional)* Local or Atlas MongoDB (if omitted, the app will run on the included zero-config persistent store).

### 2. Installation
From the project root:
```bash
npm run install:all
```

### 3. Start Development Servers
Run backend and frontend simultaneously with a single command:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/recipes`
- **Uploads Static Route**: `http://localhost:5000/uploads`

---

## 🧪 Running Automated Tests

Run the comprehensive end-to-end API test suite:
```bash
npm run test:api
```

This verifies:
- Server health check
- Recipe retrieval & pagination
- Full-text search and nested ingredient filtering
- Recipe creation with dynamic arrays
- Single recipe retrieval
- Recipe updates (PUT)
- Social interactions (Like / Save toggles)
- Deletion and 404 response verification

---

## 🚢 Deployment Guide

### Backend Deployment (Render / Railway / Fly.io)
1. Set Environment Variables:
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/recipes`
   - `NODE_ENV=production`
2. Start Command: `node server.js`

### Frontend Deployment (Vercel / Netlify)
1. Build Command: `npm run build`
2. Output Directory: `dist`
3. Set `VITE_API_BASE_URL` to your production backend URL.

---

## 📜 Suggested One-Week Plan CUBRICS Reference

| Day | Objectives Completed |
|---|---|
| **Day 1** | Defined recipe data model, nested ingredients & steps subdocuments, category enums, and REST contract. |
| **Day 2** | Built Express server, MongoDB / Mongoose connection with resilient fallback, and Multer file upload setup. |
| **Day 3** | Built modern React UI: Navbar, Home, Recipe Detail, Recipe Cards, Search & Filter components, and Axios API layer. |
| **Day 4** | Built dynamic array form controls for ingredients & steps, live image previews, servings scaler, and like/save logic. |
| **Day 5** | Wrote automated API test suite, verified all CRUD flows, added empty states, error boundaries, and deployment documentation. |
