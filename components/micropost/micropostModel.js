const mongoose = require('mongoose');

const micropostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 140,
  },
  date: {
    type: Date,
    required: true,
  },
  picture: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

micropostSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Micropost', micropostSchema);
