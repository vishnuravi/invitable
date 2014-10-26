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


	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}