const express = require('express')
const router = express.Router();
const User = require('../models/Task');
const Task = require('../models/User');
const ExcelJS = require('exceljs');

router.get('/users/new', (req, res) => {
    res.render('userForm');
});

router.post('/users/add', async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        await User.query().insert({ name, email, mobile });
        res.redirect('/users/new');
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Error adding user.");
    }
});

router.get('/tasks/new', async (req, res) => {
    try {
        const users = await User.query().select('id', 'name');
        res.render('taskForm', { users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users.");
    }
});

router.post('/tasks/add', async (req, res) => {
    const { user_id, task_name, task_type } = req.body;
    try {
        await Task.query().insert({ user_id, task_name, task_type });
        res.redirect('/tasks/new');
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Error adding task.");
    }
});

router.get('/export/excel', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    
    const userSheet = workbook.addWorksheet('Users');
    userSheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Mobile', key: 'mobile', width: 15 },
    ];
    const users = await User.query();
    users.forEach((user) => userSheet.addRow(user));

    const taskSheet = workbook.addWorksheet('Tasks');
    taskSheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'User ID', key: 'user_id', width: 10 },
        { header: 'Task Name', key: 'task_name', width: 25 },
        { header: 'Task Type', key: 'task_type', width: 15 },
    ];
    const tasks = await Task.query();
    tasks.forEach((task) => taskSheet.addRow(task));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users_tasks.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
});

router.get('/tasks/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const tasks = await Task.query().where({ user_id });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks.");
    }
});

// Fetch tasks for a specific user by user_id
// const Task = require('./models/Task');

// async function getUserTasks(userId) {
//     try {
//         const tasks = await Task.query().where('user_id', userId);
//         console.log(tasks);
//     } catch (err) {
//         console.error('Error fetching tasks:', err);
//     }
// }


module.exports = router;