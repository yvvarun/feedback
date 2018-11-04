const passport = require("passport");
//TODO: not sure if .Strategy is needed. check.
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
//1 argument means we're trying to fetch something from mongoose,
//2 arguments means we're trying to load something. (this needs to be done only once.)
//being done in User.js
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  //serializeUser is called as part of GoogleStrategy.
  //passport has context of user (check below -> passport.use)
  //this is NOT google profile id. in the "users" database, each record/row has
  //an id (generated by mongo). we're using that.
  //user.id is passed to cookieSession which will set req.session and also,
  //user.id is sent to the browser by cookieSession to be used as cookie for
  //every follow up request by the user/browser
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    //deserializeUser is called by passport middleware when user makes a request.
    //passport figures out id from req.session object.
    //(NOTE: req.session object is set by cookieSession middleware
    //when user makes a request.)
    //user is added to req object when we do this. (by passport middleware)
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists already in the database.
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          //already exists. don't add to the db.
          //also, passport middleware calls serializeUser with the 2nd argument.
          done(null, existingUser);
        } else {
          //creating a new instance of User. using save method to add to the database.
          //also, passport middleware calls serializeUser with the 2nd argument.
          new User({ googleId: profile.id }).save().then(user => {
            done(null, user);
          });
        }
      });
    }
  )
);