module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest',
    },
    /*  binary: {
      version: '3.4.1', // Version of MongoDB
      skipMD5: true,
    }, */
    autoStart: false,
    debug: true,
  },
};

// Issue while specifying the mongodb version  :
// Unable to install mongodb in memory from ci::issue: Error: Too small (243 bytes) mongod binary downloaded from https://fastdl.mongodb.org/linux/mongodb-linux
// several issue mongodb download url is wrong and the downloaded package is a empty package. the true url is https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.0.3.tgz
//instead of https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel-4.0.3.tgz
// @see : https://github.com/nodkz/mongodb-memory-server/issues/184
// also see :
// https://www.bountysource.com/teams/mongodb-memory-server/issues?tracker_ids=62550754
// https://www.bountysource.com/issues/73374850-access-denied-for-binary-download
// https://github.com/nodkz/mongodb-memory-server
// MONGOMS_DOWNLOAD_URL= https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.0.3.tgz (# full URL to download the mongodb binary)
// could be a solution but it create another issue with mongodb Memory Server
