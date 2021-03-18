const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: Date,
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

relationshipSchema.index({follower: 1, followed: 1}, {unique: true})

relationshipSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Relationship', relationshipSchema);
