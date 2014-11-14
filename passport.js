// passport authentication code
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//load the user model
var User = require('./routes/models/users');

//load the API keys
var auth = require('./config/auth');

//load dependencies
var validator = require('validator');
var crypto = require('crypto');

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

    // check to see if a valid email address was submitted
    if(!validator.isEmail(email)){
        return done(null, false, req.flash('signupMessage', 'The e-mail address you entered is not valid.'));
    }else{
        // check to see if a user already exists with that email
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);

            // if user already exists, flash error message
            if (user) {
                return done(null, false, req.flash('signupMessage', 'E-mail already in use.'));
            } else {

                // if no user exists with that email, create a new one
                
                // generate verification token
                crypto.randomBytes(20, function(err, buf){
                    
                    var token = buf.toString('hex');
                    
                    // create a new user and set details
                    var newUser = new User();
                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password); 
                    newUser.local.verifyToken = token;
                    newUser.local.verifyExpiry = Date.now() + 172800000; // verification tokens expire in 48 hours
                    
                    // create an email with verify link
                    var mailOptions = {
                        to: newUser.local.email,
                        from: 'invitable@vishnu.io',
                        subject: 'Activate your Invitable Account',
                        text: 'Hello,\n\n' +
                        'Click the link below (or paste it into your browser) to verify your Invitable account. This link will expire in 48 hours.\n\n' +
                        'http://' + req.headers.host + '/verify/' + token + '\n\n'
    
                    };

                    // send verify email using mailgun 
                    nodemailerMailgun.sendMail(mailOptions, function(err) {
                        if (err)
                            throw err;
                        // save user to database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    });

                });
                
            }

        });
    }

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

        clientID        : auth.facebookAuth.clientID,
        clientSecret    : auth.facebookAuth.clientSecret,
        callbackURL     : auth.facebookAuth.callbackURL,
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
