const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
  letters: [
    {
      type: String,
    },
  ],
  orders: [
    {
      type: Number,
    }
  ],
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
