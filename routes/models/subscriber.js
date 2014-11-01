var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubscriberSchema = new Schema({
  name: {type: Schema.Types.ObjectId, ref: "User"} ,
  invitable: { type: Schema.Types.ObjectId, ref: 'Invitable'}
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
