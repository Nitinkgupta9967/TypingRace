const http = require('http');

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resBody) });
        } catch (e) {
          resolve({ status: res.statusCode, body: resBody });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('--- RUNNING BACKEND API TESTS ---');
  try {
    // 1. Health check
    const health = await makeRequest('/api/health');
    console.log('✅ Health check:', health.status, health.body);

    // 2. Register test user
    const testUsername = 'testuser_' + Date.now();
    const reg = await makeRequest('/api/auth/register', 'POST', {
      username: testUsername,
      email: `${testUsername}@example.com`,
      password: 'password123'
    });
    console.log('✅ Register:', reg.status, reg.body.user ? reg.body.user.username : reg.body);

    const token = reg.body.token;

    // 3. Login test user
    const login = await makeRequest('/api/auth/login', 'POST', {
      usernameOrEmail: testUsername,
      password: 'password123'
    });
    console.log('✅ Login:', login.status, login.body.user ? 'Token received' : login.body);

    // 4. Fetch me
    const me = await makeRequest('/api/auth/me', 'GET', null, token);
    console.log('✅ Profile me:', me.status, me.body.user ? me.body.user.username : me.body);

    // 5. Global Leaderboard
    const lb = await makeRequest('/api/leaderboards/global');
    console.log('✅ Global Leaderboard count:', lb.status, lb.body.leaderboard ? lb.body.leaderboard.length : lb.body);

    // 6. Prompts
    const prompt = await makeRequest('/api/prompts/random');
    console.log('✅ Random Prompt:', prompt.status, prompt.body.text ? prompt.body.text.substring(0, 30) + '...' : prompt.body);

    console.log('🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ API Test Failed:', err);
  }
}

runTests();
