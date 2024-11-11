const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const AdminController = require('../controllers/adminController');
const isAuthenticated = require('../Middlewares/isAuthenticated')

router.get("/", AdminController.getLogin)

router.get('/register', AdminController.getRegister)

router.post('/register', AdminController.register);

router.post(
  '/login',
  passport.authenticate('local', {
      successRedirect: '/dashboard', // Adjust path as needed
      failureRedirect: '/',
      failureFlash: true
  })
);

router.get('/dashboard',isAuthenticated, AdminController.dashboard)

router.get('/logout',isAuthenticated, AdminController.logout);

module.exports = router;
