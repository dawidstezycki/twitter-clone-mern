const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    unique: true,
    maxlength: 255,
  },
  passwordHash: String,
  admin: {
    type: Boolean,
    default: false,
  },
  microposts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Micropost',
    },
  ],
  relationships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Relationship',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
