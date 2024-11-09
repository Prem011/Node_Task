const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const AdminController = require('../controllers/adminController');

router.get("/", AdminController.getLogin)

router.get('/register', AdminController.getRegister)

router.post('/register', AdminController.register);

// router.post('/login', passport.authenticate('local'), AdminController.login);

// router.post('/login', (req, res, next) => {
//   console.log('Entered Email:', req.body.email);
//   console.log('Entered Password:', req.body.password);

//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       console.error('Error during authentication:', err);
//       return next(err);
//     }
//     if (!user) {
//       console.warn('Authentication failed:', info.message);
//       return res.status(400).json({ message: info.message });
//     }

//     req.login(user, (err) => {
//       if (err) {
//         console.error('Error during login:', err);
//         return next(err);
//       }
//       console.log('User authenticated successfully');
//       return res.status(200).json({ message: 'Login successful', user });
//     });
//   })(req, res, next);
// });


router.post('/login', (req, res, next) => {
  const { password } = req.body;
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }

    // Add a log for debugging
    console.log('Entered Password:', password);
    console.log('Stored Hashed Password:', user.password); // Make sure this hash is correct

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});


  

router.get('/dashboard', AdminController.dashboard)

router.get('/logout', AdminController.logout);

module.exports = router;
