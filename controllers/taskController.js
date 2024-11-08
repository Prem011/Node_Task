
const Task = require('../models/Task');
const User = require('../models/User');
const ExcelJS = require('exceljs');

const renderTaskForm = async (req, res) => {
    try {
        const users = await User.query().select('id', 'name');
        res.render('taskForm', { users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users.");
    }
};

const addTask = async (req, res) => {
    const { user_id, task_name, task_type } = req.body;
    try {
        await Task.query().insert({ user_id, task_name, task_type });
        res.redirect('/tasks/new');
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Error adding task.");
    }
};

const exportToExcel = async (req, res) => {
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
};

// Fetch Tasks for a Single User by ID
const fetchUserTasks = async (req, res) => {
    const { user_id } = req.params;
    try {
        const tasks = await Task.query().where({ user_id });
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error fetching tasks.");
    }
};

module.exports = {
    renderTaskForm,
    addTask,
    exportToExcel,
    fetchUserTasks,
};
