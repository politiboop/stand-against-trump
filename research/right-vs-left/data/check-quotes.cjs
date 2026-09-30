// Checks every "quote" field in a data file against the saved texts in ../cache (full-path keyed).
// usage: node check-quotes.cjs values-votes.json
const fs = require('fs'), path = require('path');
const norm = (s) => s.replace(/<[^>]+>/g, ' ').replace(/[​-‏⁠﻿­]/g, '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/-\s*\n\s*/g, '-').replace(/\s+/g, ' ').replace(/ ?[—–] ?/g, '—').replace(/…/g, '...').toLowerCase();
const texts = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); const st = fs.statSync(p); if (st.isDirectory()) walk(p); else if (/\.(txt|html?|md)$/.test(f)) texts.push([p, norm(fs.readFileSync(p, 'utf8'))]); } })(path.join(__dirname, '..', 'cache'));
const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const quotes = [];
(function find(o, where) { if (Array.isArray(o)) o.forEach((x, i) => find(x, where)); else if (o && typeof o === 'object') { for (const [k, v] of Object.entries(o)) { if (k === 'quote' && typeof v === 'string') quotes.push([where || o.who || '', v]); else find(v, o.id || where); } } })(data, '');
let miss = 0;
for (const [w, q] of quotes) {
  const parts = norm(q).replace(/[.,;:]$/, '').split('...').map((s) => s.trim()).filter(Boolean);
  const hit = texts.find(([, t]) => parts.every((p) => t.includes(p)));
  if (!hit) miss++;
  console.log(hit ? 'ok  ' : 'MISS', w.padEnd(28).slice(0, 28), q.slice(0, 70), hit ? '<- ' + path.relative(path.join(__dirname, '..', 'cache'), hit[0]).slice(0, 40) : '');
}
console.log(miss ? `${miss} of ${quotes.length} not found in cache` : `all ${quotes.length} quotes found`);
