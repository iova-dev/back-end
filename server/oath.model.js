const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const oathSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

module.exports = mongoose.model('Oath', oathSchema)
