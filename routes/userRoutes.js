const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController")

router.get('/listUsers', userController.getAllUsers)

router.get('/addUser', userController.getAddUser)

router.post('/addUser', userController.addUser)

router.get('/edit/:id', userController.getUserToEdit)

router.post('/edit/:id', userController.postEditUser)

router.get('/delete/:id', userController.deleteUser)

router.get('/assignTask/:id', userController.getassignTasktoUser)

router.post('/assignTask', userController.assignTasktoUser)

module.exports = router;