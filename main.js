const mongoose = require('mongoose');

const { setupMongoose } = require('./helper/init');

setupMongoose();

const Test = require('./model/test');

async function run () {
  const test = await Test.create({name: 'new author', letters: ['a', 'b']});

  console.log('Created test: ', JSON.stringify(test, null, 4));

  const testID = test._id;

  const updatedTest = await Test.findByIdAndUpdate(
    testID,
    { $addToSet: { letters: ['c', 'd'] } },
    { new: true },
  );

  console.log('updatedTest', updatedTest);

  await mongoose.connection.close();
}

run()
  .catch((e) => console.log('e', e));


