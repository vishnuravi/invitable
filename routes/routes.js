var invitable=require('./invitableRoute.js');

module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.jade');
	});

	app.get('/login', function(req, res) {
		res.render('login.jade', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup.jade', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//facebook routes
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/invitables', invitable.get)

	app.post('/invitables', invitable.create)
	app.get('/invitables/:event_id', invitable.getSingle)

};

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
