const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/alltasks', taskController.getAllTasks)

router.get("/addtask", taskController.renderTaskForm)

router.post('/add', taskController.addTask)

router.get('/edit/:id', taskController.renderEditTaskForm)

router.post('/edit/:id', taskController.updateEditTask)

router.get('/delete/:id', taskController.deleteTask)

router.get('/export/excel', taskController.exportToExcel);

// Route to fetch tasks for a specific user
router.get('/tasks/:user_id', taskController.getTasksByUserId);


module.exports = router;
