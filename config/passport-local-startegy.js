const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userSchema');

const local = new LocalStrategy({ usernameField: 'email' }, (
  email,
  password,
  done
) => {
  User.findOne({ email }, (error, user)  => {
    if (error) {
      console.log(`Error in finding user: ${error}`);
      return done(error);
    }

    if (!user || !user.isPasswordCorrect(password)) {
      console.log('Invalid Username/Password');
      return done(null, false);
    }
    return done(null, user);
  });
});

passport.use('local', local);

//serialize user
passport.serializeUser( (user, done) => {
  done(null, user.id);
});

//deserialize user
passport.deserializeUser( (id, done) => {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('Error in finding user--> Passport');
      return done(err);
    }
    return done(null, user);
  });
});

// check if user is authenticated
passport.checkAuthentication =  (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/users/signin');
};

// set authenticated user for views
passport.setAuthenticatedUser =  (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
