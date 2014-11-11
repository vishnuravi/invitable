var invitable = require('./invitableRoute.js');
var User = require('./models/users');
var crypto = require('crypto');
var async = require('async');
var bcrypt   = require('bcrypt-nodejs');
var auth = require('../config/auth');
var validator = require('validator');


//set up nodemailer to send e-mails
var nodemailer = require('nodemailer');
var mailgun = require('nodemailer-mailgun-transport');
var mgAuth =  {
  auth: {
    api_key: auth.mailgun.apiKey,
    domain: auth.mailgun.domain
  }
}
var nodemailerMailgun = nodemailer.createTransport(mailgun(mgAuth));


module.exports = function(app, passport) {

	// show homepage
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// show login form
	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/account',
		failureRedirect : '/login',
		failureFlash : true
	}));

  // change password
  app.get('/changePassword', isLoggedIn, function(req, res){
    res.render('changePassword.ejs', { user: req.user, message: req.flash('info'), error: req.flash('error') });
  });

  app.post('/changePassword', isLoggedIn, function(req, res){

    var user = req.user;

    // first, check if the old password entered is correct
    if(!user.validPassword(req.body.oldPassword)){
      req.flash('error', 'Your old password wasn\'t correct');
      res.redirect('/changePassword');
    }else{
      // change the password
      user.local.password = user.generateHash(req.body.newPassword);
      user.save(function(err) {
        res.redirect('/account');
      }); 
    }

  });

	// forgot password
	app.get('/forgotPassword', function(req, res){
		res.render('forgotPassword.ejs', { user: req.user, message: req.flash('info'), error: req.flash('error') });
	});

	app.post('/forgotPassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ 'local.email': req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'There is no account with that e-mail address.');
          return res.redirect('/forgotPassword');
        }

        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpiry = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var mailOptions = {
        to: user.local.email,
        from: 'postmaster@invitable.vishnu.io',
        subject: 'Invitable Password Reset',
        text: 'Hi! Someone asked for your Invitable account password to be reset.\n\n' +
          'If it wasn\'t you please ignore this message. If it was you, please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/resetPassword/' + token + '\n\n'
      };
      nodemailerMailgun.sendMail(mailOptions, function(err) {
        req.flash('info', 'E-mail sent to ' + user.local.email);
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgotPassword');
  });
});


// reset password
app.get('/resetPassword/:token', function(req, res) {
  User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpiry': { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'The password reset link is invalid or has expired.');
      return res.redirect('/forgotPassword');
    }
    res.render('resetPassword.ejs', {
      user: req.user, message: req.flash('info'), error: req.flash('error')
    });
  });
});

app.post('/resetPassword/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpiry': { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'The password reset link is invalid or has expired.');
          return res.redirect('back');
        }

        user.local.password = user.generateHash(req.body.password);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpiry = undefined;

        user.save(function(err) {
          req.login(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var mailOptions = {
        to: user.local.email,
        from: 'invitable@vishnu.io',
        subject: 'Your Invitable account password has been changed!',
        text: 'Hello,\n\n' +
          'The password for your account on Invitable with the email - ' + user.local.email + ' - has just been changed.\n'
      };
      nodemailerMailgun.sendMail(mailOptions, function(err) {
        req.flash('info', 'Your Invitable password has been changed!');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/login');
  });
});
	// Find Invites
	app.get('/invites', isLoggedIn, function(req, res) {
		res.render('invites.ejs', {
			user : req.user
		});
	});
	app.get('/submit', isLoggedIn, function(req, res) {
		res.render('submit.ejs', {
			user : req.user
		});
	});	
	// show signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/account',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	// show the user's profile
	app.get('/account', isLoggedIn, function(req, res){
		res.render('account.ejs', {
			user : req.user
		});
	})

	// go to facebook to authenticate the user
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/account',
			failureRedirect : '/'
		}));

	// for users that are already authenticated, we can connect additional accounts

	// show local account creation page
	app.get('/connect/local', isLoggedIn, function(req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });

	// attempt to connect local account, on error send back to local account creation page
	app.post('/connect/local', isLoggedIn, passport.authenticate('local-signup', {
    successRedirect : '/account',
    failureRedirect : '/connect/local',
    failureFlash : true
  }));

  // if user is connecting a facebook account, send to facebook to do the authentication
  app.get('/connect/facebook', isLoggedIn, passport.authorize('facebook', { scope : 'email' }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback', isLoggedIn,
      passport.authorize('facebook', {
      successRedirect : '/account',
			failureRedirect : '/'
  }));

	// users can unlink connected accounts

	// unlink the local account
  app.get('/unlink/local', isLoggedIn, function(req, res) {
      var user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(function(err) {
          res.redirect('/account');
      });
  });

  // unlink the facebook account
  app.get('/unlink/facebook', isLoggedIn, function(req, res) {
      var user = req.user;
      user.facebook.token = undefined;
      user.save(function(err) {
          res.redirect('/account');
      });
  });

	// logout the user
	app.get('/logout', isLoggedIn, function(req, res) {
		req.logout();
		res.redirect('/');
	});


// API endpoints

	app.get('/invitables', invitable.get); // get all invitables
	app.post('/invitables', invitable.create); // create an invitable
	app.get('/invitables/:event_id', invitable.getSingle); // get an invitable by id
	app.get('/invitables/:event_id/:user_name', invitable.addUserToEvent); // subscribe a user to an invitable queue
	app.get('/subscriber/invitables/:user_name', invitable.getSub); // get all queues a user is subscribed to
	app.get('/subscriber/users/:event_name', invitable.getInvitableSubs)// get all users in a queue
	app.post('/subscriber/delete', invitable.deleteSub); // delete a subscriber
	app.post('/invitables/delete', invitable.deleteInvitable); // delete an invitable
	app.get('/user/increment/sends/:user_name'); // increment invites sent
	app.get('/user/increment/receives/:user_name') // increment invites received
	app.post('/subscriber/send', invitable.sendEmail); // send an invite to a subscriber
};

// route middleware to see if a user is logged in
function isLoggedIn(req, res, next) {

	// if user is logged in, continue
	if (req.isAuthenticated())
		return next();

	// else, send them to the login page
  req.flash('loginMessage', 'Please login to access this.');
	res.redirect('/login');
}
