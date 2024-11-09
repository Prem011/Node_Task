
const Task = require('../models/Task');
const User = require('../models/User');
const ExcelJS = require('exceljs');

const renderTaskForm = async (req, res) => {
    try {
        const users = await User.query().select('id', 'name');
       
        // console.log(users)
        
        if (users.length === 0) {
            return res.render('./users/addTask', { users: null, message: "No users are available to assign tasks." });
        }

        res.render('./tasks/addTask', { users });
    } catch (error) 
    {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users.");
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.query()
            .select('id', 'task_name', 'task_type', 'user_id')  // Explicitly select necessary task fields
            .withGraphFetched('user') // Fetch associated user details
            .modifyGraph('user', builder => {
                builder.select('id', 'name', 'email', 'mobile'); // Select only needed user fields
            });
        res.render("./tasks/listTasks", { tasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Error fetching tasks.");
    }
};

const addTask = async (req, res) => {
    // Parse user_id as an integer
    const taskData = {
        user_id: parseInt(req.body.user_id, 10), // Convert user_id to integer
        task_name: req.body.task_name,
        task_type: req.body.task_type
    };

    if (isNaN(taskData.user_id)) {
        return res.status(400).send("Invalid user_id: Must be an integer");
    }

    Task.query()
        .insert(taskData)
        .then(() => res.redirect('/task/alltasks')) // Adjust redirect as needed
        .catch((error) => {
            console.error("Error adding task:", error);
            res.status(500).send("Internal Server Error");
        });
};

const renderEditTaskForm = async (req, res) => {
    const taskId = req.params.id;

    try {
        const users = await User.query().select('id', 'name');
        const task = await Task.query().findById(taskId).withGraphFetched('user'); 

        if (!task) {
            return res.status(404).send("Task not found.");
        }

        res.render('./tasks/editTaskStatus', { task, users });
    } catch (error) {
        console.error("Error fetching task:", error);
    }
};

const updateEditTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { task_type } = req.body;

        // Use Objection to update the task with the given ID
        const rowsUpdated = await Task.query()
            .findById(taskId)
            .patch({
                task_type
            });

        // Check if the task was found and updated
        if (rowsUpdated) {
            res.redirect('/task/alltasks');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Server Error');
    }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.query().findById(taskId);
        if (!task) {
                alert('Task not found');
        }

        await Task.query().deleteById(taskId);

        // res.status(200).send('Task deleted successfully');
        // Alternatively, redirect to the tasks page after deletion:
        res.redirect('/task/alltasks');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Server error');
    }
};

const exportToExcel = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();

        // User Sheet
        const userSheet = workbook.addWorksheet('Users');
        userSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Mobile', key: 'mobile', width: 15 },
        ];

        const users = await User.query();
        users.forEach((user) => userSheet.addRow(user));

        // Task Sheet
        const taskSheet = workbook.addWorksheet('Tasks');
        taskSheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'User ID', key: 'user_id', width: 10 },
            { header: 'Task Name', key: 'task_name', width: 25 },
            { header: 'Task Type', key: 'task_type', width: 15 },
        ];

        const tasks = await Task.query();
        tasks.forEach((task) => taskSheet.addRow(task));

        // Set headers for Excel file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users_tasks.xlsx');

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        res.status(500).send('Server error while exporting to Excel');
    }
};

// Fetch tasks for a specific user by user ID
const getTasksByUserId = async (req, res) => {
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
    deleteTask,
    updateEditTask,
    renderEditTaskForm,
    getAllTasks,
    renderTaskForm,
    addTask,
    exportToExcel,
    getTasksByUserId
};
