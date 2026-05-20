const fs = require('fs');
const readline = require('readline');

async function search() {
  const fileStream = fs.createReadStream('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\f72ef47f-75db-450d-8b69-de353716fd6d\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    if (line.toLowerCase().includes('lumierebeauty.io.vn') || line.toLowerCase().includes('host') || line.toLowerCase().includes('domain') || line.toLowerCase().includes('cpanel') || line.toLowerCase().includes('deploy')) {
      // Parse the JSON line to extract content
      try {
        const obj = JSON.parse(line);
        if (obj.content && obj.content.length < 500) {
          console.log(`Line ${lineCount} [${obj.type}]: ${obj.content}`);
        } else if (obj.content) {
          console.log(`Line ${lineCount} [${obj.type}]: ${obj.content.substring(0, 200)}...`);
        }
      } catch (e) {
        // Not a JSON line
      }
    }
  }
}

search().catch(console.error);
