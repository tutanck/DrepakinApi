const mongoose = require('mongoose');

const clearCollections = async collections => {
  if (!collections) {
    collections = mongoose.connection.collections;
  }

  for (var collection in collections) {
    await mongoose.connection.collections[collection].deleteMany({});
  }
};

const connect = async () => {
  await mongoose.connect(
    global.__MONGO_URI__,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    },
  );
};

const disconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { clearCollections, connect, disconnect };
