const fs = require('fs');
const mongoose = require('mongoose');
const ExpertCenter = require('../models/ExpertCenter');
const { getFormatedInstant } = require('../utils/toolbox');

const { green } = require('chalk');

const serializeDB = async (destDir, withMongoMetas) => {
  const destFileName = `${destDir}/snapshot_${getFormatedInstant()}.json`;

  mongoose.set('toJSON', { virtuals: false });

  // connect to mongoose
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', async () => {
    console.log(green('Mongoose is connected to Mongodb.'));

    const removeMongoMetasOptions = { _id: 0, __v: 0 };

    // !IMPORTANT : Avoid serializing id virtual
    ExpertCenter.schema.options.toJSON = false;

    const ecList = await ExpertCenter.find(
      {},
      withMongoMetas === 'true' ? undefined : removeMongoMetasOptions,
    );

    fs.writeFileSync(destFileName, JSON.stringify(ecList), 'utf8');

    db.close();

    console.log(green('Done !'));
  });
};

const options = process.argv.slice(2);

serializeDB('drepakin-secret/versions', ...options);
