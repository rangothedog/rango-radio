const fs = require('fs');

class Config {
  constructor(filePath) {
    this.filePath = filePath;
  }

  read() {
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data);
  }
}

module.exports = Config;