const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');  

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',  
      // usernameField: 'username',  
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const admin = await Admin.query().findOne({ email });
        if (!admin) {
          return done(null, false, { message: 'Incorrect email or user does not exist.' });
        }

        const isValid = await admin.validatePassword(password);
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, admin);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.query().findById(id);
    done(null, admin);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
