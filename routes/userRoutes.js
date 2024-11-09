const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")

router.get('/listUsers', userController.getAllUsers)

router.get('/addUser', userController.getAddUser)

router.post('/addUser', userController.addUser)

module.exports = router;