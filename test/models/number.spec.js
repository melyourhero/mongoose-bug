const mongoose = require('mongoose');

const Test = require('../../model/test');

describe('Simple bug reproducing #2', () => {
  let docID = null;

  before(async () => {
    await mongoose.connect('mongodb://localhost/test-app')
      .catch((error) => {
        console.log(`Mongoose connection error: ${error.message}`);
      });

    const connection = mongoose.connection;

    connection
      .once('open', () => console.log('Mongoose successfully connect'))
      .on('connected', () => console.log('Mongoose default connection open'))
      .on('error', () => console.log('Mongoose connection error'));
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create another test collection as specified in documentation', async () => {
    const expectedArray = [1, 2];
    const doc = await Test.create({ orders: expectedArray });

    expect(doc).to.have.property('orders').be.an.instanceof(Array);
    expect(doc).to.have.property('orders').to.have.lengthOf(2);
    expect(doc).to.have.property('orders').to.be.eql(expectedArray);

    docID = doc._id;
  });

  it('should update test collection as specified in documentation using $addToSet operator', async () => {
    const expectedArray = [1, 2, [3]];
    const unexpectedArray = [];
    const options = { new: true };
    const doc = await Test.findByIdAndUpdate(docID, { $addToSet: { orders: [3] } }, options);

    expect(doc).to.have.property('orders').be.an.instanceof(Array);
    expect(doc).to.have.property('orders').to.not.have.lengthOf(3);
    expect(doc).to.have.property('orders').to.have.lengthOf(0);
    expect(doc).to.have.property('orders').to.not.eql(expectedArray);
    expect(doc).to.have.property('orders').to.be.eql(unexpectedArray);
  });
});