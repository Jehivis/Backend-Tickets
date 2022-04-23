const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2");

const User = require('../models/User');

passport.use(
    new GoogleStrategy({
        //Options for the google strat
        callbackURL: "/auth/google/redirect",
        clientID:keyF.google.clientID,
        clientSecret: keyF.google.clientSecret
      },
      (accesstoken, refeshToken, profile,email, done) => {
          console.log(email);
          var email = email.emails[0].value;
          user.findOne({ email }, (err, usuario) => {
            if (!usuario) {
              return done(null, false, {
                message: `Email ${email} no esta registrado`
              });
            } else {
               
                  return done(null, usuario); 
            }
          });
      }
      )
  );