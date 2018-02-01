const mongoose = require('mongoose');

const Test = require('../../model/test');

describe('Simple bug reproducing #1', () => {
  let docID = null;

  before(async () => {
    await mongoose.connect('mongodb://localhost/test-app')
      .catch((error) => console.log(`Mongoose connection error: ${error.message}`));

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

  it('should create test collection as specified in documentation', async () => {
    const expectedArray = ['a', 'b'];
    const doc = await Test.create({ letters: expectedArray});

    expect(doc).to.have.property('letters').be.an.instanceof(Array);
    expect(doc).to.have.property('letters').to.have.lengthOf(2);
    expect(doc).to.have.property('letters').to.be.eql(expectedArray);

    docID = doc._id;
  });

  it('should update test collection as specified in documentation using $addToSet operator', async () => {
    const expectedArray = ['a', 'b', 'c', 'd'];
    const unexpectedArray = ['a', 'b', 'c,d'];
    const options = { new: true };
    const doc = await Test.findByIdAndUpdate(docID, { $addToSet: { letters: ['c', 'd'] } }, options);

    expect(doc).to.have.property('letters').be.an.instanceof(Array);
    expect(doc).to.have.property('letters').to.have.lengthOf(3);
    expect(doc).to.have.property('letters').to.not.eql(expectedArray);
    expect(doc).to.have.property('letters').to.be.eql(unexpectedArray);
  });
});