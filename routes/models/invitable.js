var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InvitableSchema = new Schema({
  name: String,
  metadata: {
    url : String,
    about: String,
    email: String,
    creation: Date
  }
});

module.exports = mongoose.model('Invitable', InvitableSchema);
