const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const AdminController = require('../controllers/adminController');

router.get("/", AdminController.getLogin)

router.get('/register', AdminController.getRegister)

router.post('/register', AdminController.register);

// router.post('/login', passport.authenticate('local'), AdminController.login);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message }); // Return error message
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ message: 'Login successful', user }); // Send success response
      });
    })(req, res, next);
  });
  

router.get('/dashboard', AdminController.dashboard)

router.get('/logout', AdminController.logout);

module.exports = router;
