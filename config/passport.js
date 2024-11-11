const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');  
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', // This matches the field name in req.body
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Find admin by username
        const admin = await Admin.query().findOne({ username });
        
        // If admin not found, return with a failure message
        if (!admin) {
          return done(null, false, { message: 'Incorrect username or user does not exist.' });
        }

        // Compare the provided password with the hashed password in the database
        const isValid = await bcrypt.compare(password, admin.password);

        // If password is incorrect, return failure
        // if (!isValid) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }

        // Authentication successful, return the user
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
