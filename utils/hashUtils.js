const crypto = require('crypto');
const fs = require('fs');
const HASH_FILE_PATH = './previousHash.txt';

function generateHash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

function readPreviousHash() {
  try {
    return fs.readFileSync(HASH_FILE_PATH, 'utf8');
  } catch (err) {
    return null; // No previous hash file, this must be the first run
  }
}

function saveCurrentHash(hash) {
  fs.writeFileSync(HASH_FILE_PATH, hash, 'utf8');
}

module.exports = { generateHash, readPreviousHash, saveCurrentHash };
