const fs = require('fs');
const mongoose = require('mongoose');
const ExpertCenter = require('../models/ExpertCenter');
const { green } = require('chalk');

const serializeDB = async destinationFileName => {
  const ecList = await ExpertCenter.find();

  fs.writeFileSync(destinationFileName, JSON.stringify(ecList), 'utf8');
};

// connect to mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async () => {
  console.log(green('Mongoose is connected to Mongodb.'));

  await serializeDB('secret/tmp/json/ecs');

  db.close();
});
