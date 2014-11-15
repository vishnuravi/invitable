var auth = require('../config/auth');
var Invitables = require('./models/invitable');
var Subscribers = require('./models/subscriber');
var Users = require('./models/users');
var Q = require('q');
var nodemailer = require('nodemailer');
var mailgun = require('nodemailer-mailgun-transport');
var mgAuth =  {
  auth: {
    api_key: auth.mailgun.apiKey,
    domain: auth.mailgun.domain
  }
}
var nodemailerMailgun = nodemailer.createTransport(mailgun(mgAuth));

exports.sendEmail = function(req,res){
  // req.body.sender;
  // req.body.receiver;
  // req.body.inviteCode;
  // req.body.service;

  function findEmail(){
    return Q(Users.findById(req.body.receiver).exec(function (err, user){}))
  }

  findEmail().then(function(user){
    if(user.local.email ){
      return user.local.email;
    }
    if(user.facebook.email){
      return user.facebook.email;
    }
  })
  .then(function(user){
    var mailOptions = {
      to: user,
      from: 'invitable@vishnu.io',
      subject: 'Your invite to ' + req.body.service,
      text: 'Hello,\n\n' +
        'The code for this service is- ' + req.body.inviteCode
    };
    nodemailerMailgun.sendMail(mailOptions, function(err) {
      (err ? res.send(err) : res.send(200));
    });
  })

}
