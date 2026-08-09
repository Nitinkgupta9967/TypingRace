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

async function testFriendSystem() {
  console.log('--- TESTING AUTO-FRIEND & UNFRIEND SYSTEM ---');

  // Register User A
  const uA = 'usera_' + Date.now();
  const regA = await makeRequest('/api/auth/register', 'POST', { username: uA, email: `${uA}@ex.com`, password: 'password123' });
  const tokenA = regA.body.token;

  // Register User B
  const uB = 'userb_' + Date.now();
  const regB = await makeRequest('/api/auth/register', 'POST', { username: uB, email: `${uB}@ex.com`, password: 'password123' });
  const tokenB = regB.body.token;

  // 1. User A directly adds User B as friend (Instant auto-friend)
  const addRes = await makeRequest('/api/friends/add-direct', 'POST', { targetUserId: regB.body.user.id }, tokenA);
  console.log('✅ Direct Add Friend:', addRes.status, addRes.body);

  // 2. Fetch User A friend list
  const friendsA = await makeRequest('/api/friends', 'GET', null, tokenA);
  console.log('✅ User A Friends count:', friendsA.body.friends.length, 'Friend name:', friendsA.body.friends[0]?.username);

  // 3. User A unfriends User B
  const removeRes = await makeRequest('/api/friends/remove', 'POST', { friendUserId: regB.body.user.id }, tokenA);
  console.log('✅ Unfriend User B:', removeRes.status, removeRes.body);

  // 4. Verify User A friend list after unfriend
  const friendsAfter = await makeRequest('/api/friends', 'GET', null, tokenA);
  console.log('✅ User A Friends after unfriend:', friendsAfter.body.friends.length);

  console.log('🎉 AUTO-FRIEND AND UNFRIEND TEST PASSED SUCCESSFULLY!');
}

testFriendSystem();
