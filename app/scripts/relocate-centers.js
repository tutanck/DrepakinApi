const fs = require('fs');
const loadJsonFile = require('load-json-file');
const { getJsonFileNames, sleep } = require('../utils/toolbox');
const NodeGeocoder = require('node-geocoder');

const relocate = async (directoryPath, GOOGLE_GEOCODING_API_KEY) => {
  const options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: GOOGLE_GEOCODING_API_KEY,
    formatter: null, // 'gpx', 'string', ...
  };

  const geocoder = NodeGeocoder(options);

  const jsonFileNames = getJsonFileNames(directoryPath);

  for (const fileName of jsonFileNames) {
    console.log('relocating >>>', fileName);

    const ecList = await loadJsonFile(fileName);

    const relocatedEcList = [];

    for (const ec of ecList) {
      const places = await geocoder.geocode(ec.address);

      if (places.length === 0) {
        throw 'UNKNOWN PLACE';
      }

      const place = places[0];

      const { latitude, longitude } = place;

      const relocatedEc = {
        ...ec,
        meta: { place },
        location: { type: 'Point', coordinates: [longitude, latitude] },
      };

      relocatedEcList.push(relocatedEc);

      await sleep(10); // Due to UnhandledPromiseRejectionWarning: Error: Status is OVER_QUERY_LIMIT. You have exceeded your rate-limit for this API.
    }

    fs.writeFileSync(fileName, JSON.stringify(relocatedEcList), 'utf8');
  }
};

relocate('public/data/json/ecs', process.argv.slice(2)[0]);
