const mongoose = require('mongoose');
const loadJsonFile = require('load-json-file');
const ExpertCenter = require('../models/ExpertCenter');
const { getJsonFileNames, now } = require('../utils/toolbox');
const { blue, green, redBright } = require('chalk');

const initDB = async () => {
  const ecList = await ExpertCenter.find();

  if (ecList.length !== 0) {
    console.log(
      redBright(now(), '[Warning] : Database was not empty ! Aborting..'),
    );
    return;
  }

  console.log('creating 2dsphere index...');
  await ExpertCenter.collection.createIndex({ location: '2dsphere' });

  const jsonFileNames = getJsonFileNames('public/data/json/ecs');

  for (const fileName of jsonFileNames) {
    console.log('inserting >>>', fileName);

    const ecList = await loadJsonFile(fileName);

    /* VALIDATION PHASE HERE */
    const centers = ecList.map(ec => new ExpertCenter(ec).toJSON());

    await ExpertCenter.insertMany(centers);
  }

  console.log(blue(now(), 'Database initialised !'));
};

const MONGODB_TESTS_URI = 'mongodb://localhost/drepakin_tests';

// connect to mongoose
mongoose.connect(MONGODB_TESTS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {
  console.log(green('Mongoose is connected to Mongodb.'));

  await initDB();

  db.close();
});
