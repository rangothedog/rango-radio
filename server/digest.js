const crypto = require('crypto');
const input = process.argv[2];
const hash = crypto.createHash('sha256').update(input).digest('hex');
console.log(`The SHA-256 hash of '${input}' is (${hash.length}): ${hash}`);