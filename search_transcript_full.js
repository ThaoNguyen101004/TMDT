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
    const lower = line.toLowerCase();
    if (lower.includes('cpanel') || lower.includes('domain') || lower.includes('hosting') || lower.includes('tên miền') || lower.includes('deploy')) {
      try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
          // If it contains a stack trace, clean it
          let text = obj.content;
          if (text.includes('dispatchXhrRequest')) {
            text = text.substring(0, 150) + ' ... [truncated stack trace] ...';
          }
          console.log(`Line ${lineCount} [USER]: ${text}`);
        }
      } catch (e) {}
    }
  }
}

search().catch(console.error);
