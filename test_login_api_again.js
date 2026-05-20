const http = require('http');

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: responseBody
        });
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function testLogin(email, password) {
  try {
    console.log(`Trying to login with email: ${email}, password: ${password}`);
    const res = await postJson('http://localhost:12345/api/auth/login', { email, password });
    console.log(`RESULT for ${email}: Status ${res.status}, Body: ${res.body}`);
  } catch (error) {
    console.error(`FAILED for ${email}:`, error.message);
  }
}

async function main() {
  console.log('--- Testing custom password: Thaonguyen101004@ ---');
  await testLogin('admin@lumierebeauty.vn', 'Thaonguyen101004@');
  await testLogin('ngothaonguyenyl@gmail.com', 'Thaonguyen101004@');
  
  console.log('--- Testing fallback admin account password: Password123! ---');
  await testLogin('admin@lumiere.vn', 'Password123!');
}

main().catch(console.error);
