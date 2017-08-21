const fs = require('fs');

const readPromise = (path, encoding = 'utf8') => new Promise((resolve, reject) => {
  fs.readFile(path, encoding, (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  });
});

module.exports = {
  readPromise,
}
