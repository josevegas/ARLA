const http = require('http');

async function post(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function put(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  console.log('Testing Admin Game Management...');
  
  // 1. LOGIN
  const loginRes = await post('http://localhost:3000/api/auth/login', {
    email: 'superadmin@arla.com',
    password: 'Jlvm2612@'
  });
  
  if (loginRes.status !== 200) {
    console.error('Login Failed:', loginRes.body);
    process.exit(1);
  }
  
  const token = loginRes.body.token;
  console.log('Login Succeeded.');

  // 2. CREATE GAME
  const createRes = await post('http://localhost:3000/api/admin/games', {
    name: 'Integrity Test Game',
    description: 'Verifying game management flow',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 60,
    stock: 5,
    stockVenta: 2,
    price: 49.99,
    categoryIds: [], 
    difficultyId: null
  }, token);

  if (createRes.status !== 201) {
    console.error('Create Game Failed:', createRes.body);
    process.exit(1);
  }
  
  const game = createRes.body;
  console.log('Game Created:', game.id, game.name);

  // 3. UPDATE GAME
  const updateRes = await put(`http://localhost:3000/api/admin/games/${game.id}`, {
    name: 'Integrity Test Game MODIFIED',
    description: 'Updated description',
    minPlayers: 1,
    maxPlayers: 6,
    duration: 120,
    stock: 10,
    stockVenta: 5,
    price: 59.99,
    categoryIds: [],
    difficultyId: null
  }, token);

  if (updateRes.status !== 200) {
    console.error('Update Game Failed:', updateRes.body);
    process.exit(1);
  }

  console.log('Game Updated:', updateRes.body.name);
  console.log('FULL TEST PASSED!');
}

test().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
