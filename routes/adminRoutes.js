const express = require('express');
const router = express.Router();
const passport = require('passport');
const AdminController = require('../controllers/adminController');

router.get('/register', AdminController.getRegister)

router.post('/register', AdminController.register);

router.get('/login', AdminController.getRegister)

router.post('/login', passport.authenticate('local'), AdminController.login);

router.get('/dashboard', AdminController.dashboard)

router.get('/logout', AdminController.logout);

module.exports = router;
