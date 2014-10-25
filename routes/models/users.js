var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  userName: String,
  passWord: String,
  email: String,
  website: String
});

module.exports = mongoose.model('User', UserSchema);
