var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


// schema for user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        resetPasswordToken  : String,
        resetPasswordExpiry : Date
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    invitesGiven : { type: Number, default: 0 },
    invitesReceived : { type: Number, default: 0},
    admin : boolean
});

// generate a password hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// expose user model to the app
module.exports = mongoose.model('User', userSchema);
