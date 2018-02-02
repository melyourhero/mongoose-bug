const mongoose = require('mongoose');

const gizmoSchema = mongoose.Schema({
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

const Gizmo = mongoose.model('Gizmo', gizmoSchema);

module.exports = Gizmo;
