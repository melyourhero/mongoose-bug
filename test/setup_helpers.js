const chai = require('chai');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const dbName = 'mongodb-test';

global.chai = chai;
global.expect = chai.expect;

async function closeMongooseConnection() {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
}

async function connectMongoose() {
  await mongoose.connect(`mongodb://localhost/${dbName}`)
    .catch((error) => {
      console.log(`Mongoose connection error: ${error.message}`);
    });

  const connection = mongoose.connection;

  connection
    .once('open', () => console.log('Mongoose successfully connect'))
    .on('connected', () => console.log('Mongoose default connection open'))
    .on('error', () => console.log('Mongoose connection error'));
}

function getNativeMongoClient() {
  const url = 'mongodb://localhost:27017';
  return MongoClient.connect(url);
}

function getCollection(client, collectionName = 'author') {
  const db = client.db(dbName);
  return db.collection(collectionName);
}

module.exports = {
  closeMongooseConnection,
  connectMongoose,
  getCollection,
  getNativeMongoClient,
};
