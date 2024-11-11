const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const isAuthenticated = require('../Middlewares/isAuthenticated')

router.get('/alltasks',isAuthenticated, taskController.getAllTasks)

router.get("/addtask",isAuthenticated, taskController.renderTaskForm)

router.post('/add',isAuthenticated, taskController.addTask)

router.get('/edit/:id',isAuthenticated, taskController.renderEditTaskForm)

router.post('/edit/:id',isAuthenticated, taskController.updateEditTask)

router.get('/delete/:id',isAuthenticated, taskController.deleteTask)

router.get('/export/excel',isAuthenticated, taskController.exportToExcel);

// Route to fetch tasks for a specific user
router.get('/tasks/:user_id',isAuthenticated, taskController.getTasksByUserId);


module.exports = router;
