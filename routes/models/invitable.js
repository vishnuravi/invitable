var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var InvitableSchema = new Schema({
  id: Number,
  name: String,
  url : String,
  about: String,
  email: String,
  creation: Date,
  sendable: Boolean
});

module.exports = mongoose.model('Invitable', InvitableSchema);
