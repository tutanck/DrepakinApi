const fs = require('fs');
const path = require('path');

const isInstanceOfSome = typesList => tobeMatched =>
  typesList.some(oneType => tobeMatched instanceof oneType);

const getJsonFileNames = directoryPath => {
  const fileNames = fs.readdirSync(directoryPath);

  const fullFilleNames = fileNames.map(
    fileName => directoryPath + '/' + fileName,
  );

  const jsonFileNames = fullFilleNames.filter(
    fileName => path.extname(fileName) !== 'json',
  );

  return jsonFileNames;
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const now = () => new Date();

module.exports = { isInstanceOfSome, getJsonFileNames, sleep, now };
