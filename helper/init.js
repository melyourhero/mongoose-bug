const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function connectMongoose() {
  mongoose
    .connect('mongodb://localhost/test-app')
    .catch((error) => {
      console.log(`Mongoose connection error: ${error.message}`);
    });
}

const setupMongoose = () => {
  connectMongoose();

  mongoose.connection
    .once('open', () => console.log('Mongoose successfully connect'))
    .on('connected', () => console.log('Mongoose default connection open'))
    .on('disconnected', () => {
      console.log('Mongoose default connection disconnected');
    });
};

module.exports = {
  setupMongoose,
};