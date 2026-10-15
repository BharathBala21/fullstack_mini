const http = require('http');
const { DEFAULT_PORT } = require('./backend/config/constants');

const PORT = process.env.PORT || DEFAULT_PORT;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Testing Recipe API endpoints...\n');
  let testCount = 0;
  let passCount = 0;

  function assert(desc, condition) {
    testCount++;
    if (condition) {
      passCount++;
      console.log(`  [PASS] ${desc}`);
    } else {
      console.error(`  [FAIL] ${desc}`);
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert('GET /api/health', health.status === 200 && health.data.status === 'healthy');

    // 2. GET /api/recipes
    const all = await request('GET', '/api/recipes');
    assert('GET /api/recipes', all.status === 200 && Array.isArray(all.data.data));

    // 3. GET /api/recipes?search=chicken
    const searchRes = await request('GET', '/api/recipes?search=chicken');
    assert('GET /api/recipes?search=chicken', searchRes.status === 200 && searchRes.data.data.length > 0);

    // 4. GET /api/recipes?ingredient=garlic
    const ingRes = await request('GET', '/api/recipes?ingredient=garlic');
    assert('GET /api/recipes?ingredient=garlic', ingRes.status === 200 && ingRes.data.data.length > 0);

    // 5. GET /api/recipes/categories
    const catRes = await request('GET', '/api/recipes/categories');
    assert('GET /api/recipes/categories', catRes.status === 200 && Array.isArray(catRes.data.data));

    // 6. POST /api/recipes (Create new recipe with nested ingredients and steps)
    const newRecipeData = {
      title: 'Automated Test Crispy Waffles',
      description: 'Golden Belgian waffles with maple syrup and fresh strawberries.',
      category: 'Breakfast',
      difficulty: 'Easy',
      cookingTime: 15,
      prepTime: 10,
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
      ingredients: [
        { name: 'Flour', amount: '2', unit: 'cups' },
        { name: 'Eggs', amount: '2', unit: 'large' },
        { name: 'Milk', amount: '1.5', unit: 'cups' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Whisk dry ingredients in a bowl.' },
        { stepNumber: 2, instruction: 'Pour batter into hot waffle iron and cook until golden brown.' },
      ],
      author: { name: 'Test Chef', id: 'chef_tester_1' },
    };

    const createRes = await request('POST', '/api/recipes', newRecipeData);
    assert('POST /api/recipes', createRes.status === 201 && createRes.data.success);
    const createdId = createRes.data.data._id;

    // 7. GET /api/recipes/:id
    const singleRes = await request('GET', `/api/recipes/${createdId}`);
    assert('GET /api/recipes/:id', singleRes.status === 200 && singleRes.data.data.title === newRecipeData.title);

    // 8. PUT /api/recipes/:id (Update)
    const updateRes = await request('PUT', `/api/recipes/${createdId}`, {
      title: 'Updated Crispy Waffles Deluxe',
      cookingTime: 18,
    });
    assert('PUT /api/recipes/:id', updateRes.status === 200 && updateRes.data.data.title === 'Updated Crispy Waffles Deluxe');

    // 9. POST /api/recipes/:id/like
    const likeRes = await request('POST', `/api/recipes/${createdId}/like`, { userId: 'tester_123' });
    assert('POST /api/recipes/:id/like', likeRes.status === 200 && likeRes.data.isLiked === true && likeRes.data.likes >= 1);

    // 10. POST /api/recipes/:id/save
    const saveRes = await request('POST', `/api/recipes/${createdId}/save`, { userId: 'tester_123' });
    assert('POST /api/recipes/:id/save', saveRes.status === 200 && saveRes.data.isSaved === true);

    // 11. DELETE /api/recipes/:id
    const deleteRes = await request('DELETE', `/api/recipes/${createdId}`);
    assert('DELETE /api/recipes/:id', deleteRes.status === 200 && deleteRes.data.success);

    // 12. Verify deleted
    const verifyDeleted = await request('GET', `/api/recipes/${createdId}`);
    assert('GET /api/recipes/:id (after delete returns 404)', verifyDeleted.status === 404);

    console.log(`\nResults: ${passCount} / ${testCount} tests passed.\n`);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

// Start backend server and run tests
const app = require('./backend/server.js');
setTimeout(async () => {
  await runTests();
  process.exit(0);
}, 2500);
