var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var SubscriberSchema = new Schema({
//   name: String,
//   invitable: { type: Schema.Types.ObjectId, ref: 'InvitableSchema'}
// });

var InvitableSchema = new Schema({
  id: Number,
  name: String,
  url : String,
  about: String,
  email: String,
  creation: Date,
});

module.exports = mongoose.model('Invitable', InvitableSchema);

// module.exports = mongoose.model('Subscriber', SubscriberSchema);
