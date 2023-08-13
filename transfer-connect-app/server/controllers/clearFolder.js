const path  = require('path');
const fs = require(`fs`);

const clearFolder = (folder) => {
    const directoryPath = path.join(__dirname, folder);
    fs.readdirSync(directoryPath).forEach(file => fs.unlinkSync(path.join(directoryPath, file)));
  };

module.exports.clearFolder = clearFolder;