const http = require('http');

function getCategories() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:8080/api/categories', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const cats = json.content || json;
          console.log('API returned:', cats.length, 'categories');
          cats.slice(0, 15).forEach((c, i) => {
            console.log(`  ${i+1}. ${c.id}. ${c.name}`);
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

getCategories().catch(err => console.error('Error:', err.message));
