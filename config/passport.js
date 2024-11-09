const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');  // Ensure this is the correct path to your User model

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',  // Define which field will be used for the username (typically email)
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.query().findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or user does not exist.' });
        }

        // Validate the password using the method on the User model
        const isValid = await user.validatePassword(password);
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        // Return the authenticated user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user to save only the user ID in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user by looking up the user in the database by their ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.query().findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
