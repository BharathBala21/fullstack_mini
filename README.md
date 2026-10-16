# Recipe Sharing App

A full-stack web application for discovering, sharing, and saving cooking recipes. Built with React, Express, MongoDB (Mongoose), and Multer for image uploads.

---

## Features

- **Search & Filter**: Search by title, cuisine, or specific ingredients (`GET /api/recipes?search=`, `?ingredient=`). Filter by category, difficulty, or cooking time.
- **Recipe Management**: Full CRUD flows for creating, reading, updating, and deleting recipes.
- **Dynamic Ingredients & Steps**: Structured nested JSON documents for ingredients (name, amount, unit) and step-by-step instructions.
- **Image Uploads**: Supports local image file uploads via Multer disk storage or direct image URLs.
- **Cooking Utilities**: Real-time servings scaler and interactive ingredient/step completion checkboxes.
- **Bookmarks & Likes**: Toggle like and save states per recipe.
- **Pagination**: Server-side pagination with page and limit parameters.

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | List recipes with optional query parameters (`search`, `ingredient`, `category`, `difficulty`, `maxTime`, `sort`, `page`, `limit`) |
| `POST` | `/api/recipes` | Create a recipe (JSON or multipart form-data with `image`) |
| `GET` | `/api/recipes/:id` | Fetch single recipe details |
| `PUT` | `/api/recipes/:id` | Update recipe |
| `DELETE` | `/api/recipes/:id` | Delete recipe |
| `POST` | `/api/recipes/:id/like` | Toggle like status (`{ userId }`) |
| `POST` | `/api/recipes/:id/save` | Toggle save status (`{ userId }`) |
| `GET` | `/api/recipes/categories` | Retrieve distinct categories |
| `POST` | `/api/upload` | Dedicated image upload endpoint |
| `GET` | `/api/health` | Service health status |

---

## Schema Structure

```json
{
  "_id": "rec_1792091404990_278",
  "title": "Creamy Tuscan Garlic Chicken",
  "description": "Pan-seared chicken breasts with garlic, sun-dried tomatoes, and spinach cream sauce.",
  "category": "Dinner",
  "difficulty": "Medium",
  "cookingTime": 30,
  "prepTime": 15,
  "servings": 4,
  "imageUrl": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
  "author": { "name": "Isabella", "id": "user_1" },
  "likes": 24,
  "likedBy": ["user_1"],
  "savedBy": ["user_1"],
  "ingredients": [
    { "name": "Chicken breast", "amount": "2", "unit": "breasts" },
    { "name": "Heavy cream", "amount": "1", "unit": "cup" },
    { "name": "Garlic", "amount": "4", "unit": "cloves" }
  ],
  "steps": [
    { "stepNumber": 1, "instruction": "Season chicken breasts generously with salt and pepper." },
    { "stepNumber": 2, "instruction": "Sear in olive oil for 5-6 minutes per side until golden brown." }
  ]
}
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Locally
```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/recipes`

### 3. Run Automated Tests
```bash
npm run test:api
```

---

## Project Structure

```
├── backend/
│   ├── config/          # Database connection & fallback datastore
│   ├── controllers/     # Recipe & search business logic
│   ├── middleware/      # Multer file upload & error handlers
│   ├── models/          # Mongoose schema & fallback store
│   ├── routes/          # Express route definitions
│   ├── seed/            # Default recipes
│   └── server.js        # Express application entry
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Card, Search, Form inputs, Pagination
│   │   ├── context/     # User identity and saved state
│   │   ├── pages/       # Home, Detail, Create, Edit, Saved, MyRecipes
│   │   └── services/    # Axios API client
│   └── index.html
├── test-api.js          # E2E API test suite
└── package.json
```

---

