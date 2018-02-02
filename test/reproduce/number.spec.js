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

const expected = [1, 2, [3]];

describe('$addToSet with numbers', () => {
  let client = null;
  let collection = null;
  let authorID = null;
  let gizmoID = null;

  before(async () => {
    await connectMongoose();

    client = await getNativeMongoClient();
    collection = getCollection(client, 'author');

    const author = await insertOne(collection, { orders: [1, 2] });
    const gizmo = await Gizmo.create({ orders: [1, 2] });

    authorID = author.id;
    gizmoID = gizmo._id;
  });

  after(async () => {
    await client.close();
    await closeMongooseConnection();
  });

  it('Native mongodb driver', async () => {
    await updateOne(collection, { _id: authorID }, { $addToSet: { orders: [3] } });

    const author = await findOne(collection, { _id: authorID });

    expect(author).to.have.property('_id').to.be.eql(authorID);
    expect(author).to.have.property('orders').to.be.eql(expected);

  });

  it('Mongoose ODM', async () => {
    const updateOptions = { new: true };
    const gizmo = await Gizmo.findByIdAndUpdate(gizmoID, { $addToSet: { orders: [3] } }, updateOptions);

    expect(gizmo).to.have.property('_id').to.be.eql(gizmoID);
    expect(gizmo).to.have.property('orders').to.be.eql(expected);
  });
});