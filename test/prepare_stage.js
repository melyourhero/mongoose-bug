async function insertOne(collection, insertObject) {
  const document = await collection.insertOne(insertObject);
  return {
    id: document.insertedId,
    doc: document.ops[0],
  };
}

async function findOne(collection, query) {
  return await collection.findOne(query);
}

async function updateOne(collection, query, updateObject) {
  return await collection.update(query, updateObject);
}

module.exports = {
  insertOne,
  findOne,
  updateOne,
};