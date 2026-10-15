const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

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
  console.log('🧪 Starting Recipe Sharing App API Test Suite...\n');
  let testCount = 0;
  let passCount = 0;

  function assert(desc, condition) {
    testCount++;
    if (condition) {
      passCount++;
      console.log(`  ✅ [PASS] ${desc}`);
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert('GET /api/health returns healthy', health.status === 200 && health.data.status === 'healthy');

    // 2. GET /api/recipes
    const all = await request('GET', '/api/recipes');
    assert('GET /api/recipes returns 200 with recipe list', all.status === 200 && Array.isArray(all.data.data));
    console.log(`     -> Found ${all.data.total} recipes in store`);

    // 3. GET /api/recipes?search=chicken
    const searchRes = await request('GET', '/api/recipes?search=chicken');
    assert('GET /api/recipes?search=chicken filters correctly', searchRes.status === 200 && searchRes.data.data.length > 0);

    // 4. GET /api/recipes?ingredient=garlic
    const ingRes = await request('GET', '/api/recipes?ingredient=garlic');
    assert('GET /api/recipes?ingredient=garlic filters by nested ingredient array', ingRes.status === 200 && ingRes.data.data.length > 0);

    // 5. GET /api/recipes/categories
    const catRes = await request('GET', '/api/recipes/categories');
    assert('GET /api/recipes/categories returns category array', catRes.status === 200 && Array.isArray(catRes.data.data));

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
    assert('POST /api/recipes creates recipe successfully', createRes.status === 201 && createRes.data.success);
    const createdId = createRes.data.data._id;
    console.log(`     -> Created recipe with ID: ${createdId}`);

    // 7. GET /api/recipes/:id
    const singleRes = await request('GET', `/api/recipes/${createdId}`);
    assert('GET /api/recipes/:id retrieves the created recipe', singleRes.status === 200 && singleRes.data.data.title === newRecipeData.title);

    // 8. PUT /api/recipes/:id (Update)
    const updateRes = await request('PUT', `/api/recipes/${createdId}`, {
      title: 'Updated Crispy Waffles Deluxe',
      cookingTime: 18,
    });
    assert('PUT /api/recipes/:id updates recipe title and cooking time', updateRes.status === 200 && updateRes.data.data.title === 'Updated Crispy Waffles Deluxe');

    // 9. POST /api/recipes/:id/like
    const likeRes = await request('POST', `/api/recipes/${createdId}/like`, { userId: 'tester_123' });
    assert('POST /api/recipes/:id/like toggles like to true', likeRes.status === 200 && likeRes.data.isLiked === true && likeRes.data.likes >= 1);

    // 10. POST /api/recipes/:id/save
    const saveRes = await request('POST', `/api/recipes/${createdId}/save`, { userId: 'tester_123' });
    assert('POST /api/recipes/:id/save toggles save status to true', saveRes.status === 200 && saveRes.data.isSaved === true);

    // 11. DELETE /api/recipes/:id
    const deleteRes = await request('DELETE', `/api/recipes/${createdId}`);
    assert('DELETE /api/recipes/:id deletes the recipe', deleteRes.status === 200 && deleteRes.data.success);

    // 12. Verify deleted
    const verifyDeleted = await request('GET', `/api/recipes/${createdId}`);
    assert('GET /api/recipes/:id returns 404 after deletion', verifyDeleted.status === 404);

    console.log(`\n🎉 Results: ${passCount} / ${testCount} tests passed!\n`);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

// Start server child process and run test suite
const { spawn } = require('child_process');
const server = spawn('node', ['backend/server.js'], { cwd: __dirname });

server.stdout.on('data', (d) => {
  const msg = d.toString();
  if (msg.includes('Recipe Sharing API Server is running on port')) {
    setTimeout(async () => {
      await runTests();
      server.kill();
      process.exit(0);
    }, 1000);
  }
});

server.stderr.on('data', (d) => {
  // Ignore minor deprecations
});
