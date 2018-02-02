const Gizmo = require('../model/gizmo');

const {
  closeMongooseConnection,
  connectMongoose,
  getNativeMongoClient,
  getCollection,
} = require('../setup_helpers');

const {
  findOne,
  insertOne,
  updateOne,
} = require('../prepare_stage');

const expected = ['a', 'b', ['c', 'd']];

describe('$addToSet with strings', () => {
  let client = null;
  let collection = null;
  let authorID = null;
  let gizmoID = null;

  before(async () => {
    await connectMongoose();

    client = await getNativeMongoClient();
    collection = getCollection(client, 'author');

    const author = await insertOne(collection, { letters: ['a', 'b'] });
    const gizmo = await Gizmo.create({ letters: ['a', 'b'] });

    authorID = author.id;
    gizmoID = gizmo._id;
  });

  after(async () => {
    await closeMongooseConnection();

    client.close();
  });

  it('Native mongodb driver', async () => {
    await updateOne(collection, { _id: authorID }, { $addToSet: { letters: ['c', 'd'] } });

    const author = await findOne(collection, { _id: authorID });

    expect(author).to.have.property('_id').to.be.eql(authorID);
    expect(author).to.have.property('letters').to.be.eql(expected);

  });

  it('Mongoose ODM', async () => {
    const updateOptions = { new: true };
    const gizmo = await Gizmo.findByIdAndUpdate(gizmoID, { $addToSet: { letters: ['c', 'd'] } }, updateOptions);

    expect(gizmo).to.have.property('_id').to.be.eql(gizmoID);
    expect(gizmo).to.have.property('letters').to.be.eql(expected);
  });
});