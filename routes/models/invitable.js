var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriberSchema = new Schema({name: String});

var InvitableSchema = new Schema({
  id: Number,
  name: String,
  url : String,
  about: String,
  email: String,
  creation: Date,
  subs: [SubscriberSchema]
});

module.exports = mongoose.model('Invitable', InvitableSchema);
