const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")
const isAuthenticated = require('../Middlewares/isAuthenticated')

router.get('/listUsers',isAuthenticated, userController.getAllUsers)

router.get('/addUser',isAuthenticated, userController.getAddUser)

router.post('/addUser',isAuthenticated, userController.addUser)

router.get('/edit/:id',isAuthenticated, userController.getUserToEdit)

router.post('/edit/:id',isAuthenticated, userController.postEditUser)

router.get('/delete/:id',isAuthenticated, userController.deleteUser)

router.get('/assignTask/:id',isAuthenticated, userController.getassignTasktoUser)

router.post('/assignTask',isAuthenticated, userController.assignTasktoUser)

router.get('/allTasksOfAUser/:id',isAuthenticated, userController.getallTasksOfAUser)

module.exports = router;