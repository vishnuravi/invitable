var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriberSchema = new Schema({
  name: String,
  invitable: { type: Schema.Types.ObjectId, ref: 'InvitableSchema'}
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
