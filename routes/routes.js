var invitable = require('./invitableRoute.js');
var User = require('./models/users');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');


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
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	// forgot password
	app.get('/forgotPassword', function(req, res){
		res.render('forgotPassword.ejs', { user: req.user, message: req.flash('forgotPasswordMessage') });
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
      var smtpTransport = nodemailer.createTransport();
      var mailOptions = {
        to: user.local.email,
        from: 'invitable@vishnu.io',
        subject: 'Invitable Password Reset',
        text: 'Hi! Someone asked for your Invitable account password to be reset.\n\n' +
          'If it wasn\'t you please ignore this message. If it was you, please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
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
app.post('/resetPassword/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpiry': { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'The password reset link is invalid or has expired.');
          return res.redirect('back');
        }

        user.local.password = User.generateHate(req.body.password);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport();
      var mailOptions = {
        to: user.local.email,
        from: 'invitable@vishnu.io',
        subject: 'Your Invitable account password has been changed!',
        text: 'Hello,\n\n' +
          'The password for your account on Invitable with the email - ' + user.email + ' - has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Your Invitable password has been changed!');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

	// show signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	// show the user's profile
	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.ejs', {
			user : req.user
		});
	})

	// go to facebook to authenticate the user
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));


	// logout the user
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	app.get('/invitables', invitable.get); // get all invitables
	app.post('/invitables', invitable.create); // create an invitable
	app.get('/invitables/:event_id', invitable.getSingle); // get an invitable by id
	app.get('/invitables/:event_id/:user_name', invitable.addUserToEvent); // subscribe a user to an invitable queue
	app.get('/subscriber/invitables/:user_name', invitable.getSub); // get all queues a user is subscribed to
	app.get('/subscriber/users/:event_name', invitable.getInvitableSubs)// get all users in a queue
	app.post('/subscriber/delete', invitable.deleteSub); // delete a subscriber
	app.post('/invitables/delete', invitable.deleteInvitable); // delete an invitable
};

// route middleware to see if a user is logged in
function isLoggedIn(req, res, next) {

	// if user is logged in, continue
	if (req.isAuthenticated())
		return next();

	// else, send them to home page
	res.redirect('/');
}
