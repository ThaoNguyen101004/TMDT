const http = require('http');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers
      });
    }).on('error', reject);
  });
}

async function main() {
  const imageUrl = 'http://localhost:12345/api/files/thumbnails/8ce6dd30-8a26-41b8-a45d-031ebe997fdc.webp';
  console.log(`Checking local backend image: ${imageUrl}`);
  try {
    const res = await getUrl(imageUrl);
    console.log(`STATUS: ${res.status}`);
    console.log(`CONTENT-TYPE: ${res.headers['content-type']}`);
  } catch (err) {
    console.error('FAILED to load image:', err.message);
  }
}

main().catch(console.error);
