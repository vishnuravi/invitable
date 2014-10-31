var invitable=require('./invitableRoute.js');

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

	// show the user's account
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
	app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });

	// attempt to connect local account, on error send back to local account creation page
	app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/account',
    failureRedirect : '/connect/local',
    failureFlash : true
  }));

  // if user is connecting a facebook account, send to facebook to do the authentication
  app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

  // handle the callback after facebook has authorized the user
  app.get('/connect/facebook/callback',
      passport.authorize('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
  }));


	// logout the user
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// list view of invitables
	app.get('/invitables/list', function(req, res){
		res.render('invitablesList.ejs');
	});


	// API Endpoints

	// get all invitables
	app.get('/invitables', invitable.get);

	// create an invitable
	app.post('/invitables', invitable.create);

	// get an invitable by id
	app.get('/invitables/:event_id', invitable.getSingle);

	// subscribe a user to an invitable queue
	app.get('/invitables/:event_id/:user_name', invitable.addUserToEvent);

	// get all queues a user is subscribed to
	app.get('/subscriber/:user_name', invitable.getSub)
};

// route middleware to see if a user is logged in
function isLoggedIn(req, res, next) {

	// if user is logged in, continue
	if (req.isAuthenticated())
		return next();

	// else, send them to login page
	res.redirect('/login');
}
