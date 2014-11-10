// passport authentication code
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//load the user model
var User = require('./routes/models/users');

//load the API keys
var configAuth = require('./config/auth');

//load validator
var validator = require('validator');

module.exports = function(passport) {

    // serialize the user for the current session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize the user for the current session
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    // local authentication signup code
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        // check to see if a user already exists with that email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);

            // if user already exists, flash error message
            if (user) {
                return done(null, false, req.flash('signupMessage', 'E-mail already in use.'));
            } else {

                // if no user exists with that email, create a new one
                var newUser = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); 
                

                // save user to database
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));


    // local authentication login code
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 

        // find the user
        User.findOne({ 'local.email' :  email }, function(err, user) {

            if (err)
                return done(err);

            // if no user is found, flash error message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            // if user found, but password wrong, flash error message
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect password.')); 

            // return the user
            return done(null, user);
        });

    }));


    //Facebook authentication code
    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true

    },

    function(req, token, refreshToken, profile, done) {

        process.nextTick(function() {

            // check if user is already logged in
            if(!req.user){

            // find user based on facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                // if user found, return the user
                if (user) {
                    return done(null, user); 

                } else {
                    // user not found, create a new user
                    var newUser            = new User();
                    // set facebook user data in our user model
                    newUser.facebook.id    = profile.id;                  
                    newUser.facebook.token = token;                
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value; 

                    // save the user to database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // return the new user
                        return done(null, newUser);
                    });
                }

            });
        }else{
            // user already logged in, link accounts
            var user = req.user;

            // add user's facebook data
            user.facebook.id = profile.id;
            user.facebook.token = token;
            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = profile.emails[0].value;

            // save the user to database
            user.save(function(err){
                if (err)
                    throw err;
                return done(null, user);
            });
        }

    });
}));

}
