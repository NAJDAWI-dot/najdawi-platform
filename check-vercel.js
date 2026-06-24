const https = require('https');
https.get('https://najdawi-platform-api.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) console.log('JS Bundle:', match[1]);
    else console.log('No JS bundle found in HTML', data.slice(0, 500));
  });
}).on('error', err => console.log('Error:', err.message));
