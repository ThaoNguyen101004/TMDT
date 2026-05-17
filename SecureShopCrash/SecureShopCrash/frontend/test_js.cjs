const https = require('https');
https.get('https://tmdt-livid.vercel.app/assets/index-DV4xGtXr.js', (res) => {
  console.log('Status code:', res.statusCode);
  res.on('data', () => {});
  res.on('end', () => {});
}).on('error', (err) => console.log('Error: ' + err.message));
