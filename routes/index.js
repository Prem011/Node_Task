// routes/index.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

router.get('/users/new', userController.renderUserForm);

router.post('/users/add', userController.addUser);

router.get('/tasks/new', taskController.renderTaskForm);

router.post('/tasks/add', taskController.addTask);

router.get('/export/excel', taskController.exportToExcel);

router.get('/tasks/:user_id', taskController.fetchUserTasks);

module.exports = router;
