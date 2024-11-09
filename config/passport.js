const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');  
const bcrypt = require('bcrypt')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // Ensure this matches what you're sending in req.body
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const admin = await Admin.query().findOne({ username });
        if (!admin) {
          return done(null, false, { message: 'Incorrect username or user does not exist.' });
        }

        const isValid = await bcrypt.compare(password, admin.password);
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
