// static server for browser checks: node tools/serve.js  ->  http://localhost:8732/
const http = require('http'), fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/\/$/, '/index.html'));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': path.extname(f) === '.html' ? 'text/html' : 'text/javascript', 'Cache-Control': 'no-store' }); r.end(d); } }); }).listen(8732);
