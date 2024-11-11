const User = require('../models/User');
const Task = require('../models/Task');

const getAddUser = (req, res) => {
    res.render('./users/addUser', {})
}

const addUser = async (req, res) => {
    const { name, email, mobile } = req.body;
    try {

        // Ensure email and mobile are unique before adding the user
        await User.checkUnique(email, mobile); 

        await User.query().insert({ name, email, mobile });

        res.redirect('/user/listUsers');
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send(error.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.query();

        res.render('./users/listUsers', { users: users, user: req.user  });
    } catch (err) {
        console.error("Error fetching users:", err.message);
    }
};

const getUserToEdit = async (req, res) => {
    try{
        const userId = req.params.id;

        const user = await User.query().findById(userId);

        if(!user){
            res.status(404).send('User not found');
            return;
        }

        res.render('./users/editUser', { user });
    }
    catch(err){
        console.error("Error fetching user:", err.message);
    }
}

const postEditUser = async(req, res) => {
    try{
        const userId = req.params.id;

    const rowsUpdated = await User.query().findById(userId)
            .patch({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
            })

            if(rowsUpdated){
                res.redirect('/user/listUsers');
            }
            else{
                res.status(404).send('User not found');
            }
    }
    catch(err){
        console.error("Error updating user:", err.message);
    }

}

const deleteUser = async (req, res) => {
    try{
        const userId = req.params.id;

        const user = await User.query().findById(userId)
        if(!user){
            alert("User not found")
        }

        const taskCount = await Task.query().where('user_id', userId).count();
        if (taskCount > 0) {
            return res.status(400).send("User cannot be deleted because they have tasks.");
        }

        await User.query().deleteById(userId);

        res.redirect('/user/listUsers');

    }catch(err){
        console.error("Error deleting user:", err.message);
        res.status(500).send('Error deleting user, cause Task is not deleted which is Assigned to the user.');
    }
}

const getassignTasktoUser = async(req, res) => {
    const userId = req.params.id;

    const user_name = await User.query().findById(userId).select('name')
    // console.log(user_name);
    const users = await User.query().whereNot({ id: userId });
    res.render('./users/assignTasktoUser', { users, userId, user_name });
}

const assignTasktoUser = async(req, res, next) => {

    const taskData = { 
        user_id: parseInt(req.body.user_id, 10),
        task_name: req.body.task_name,
        task_type: req.body.task_type,
    }

    if (isNaN(taskData.user_id)) {
        return res.status(400).send("Invalid user id: must be an integer");
    }

    Task.query().insert(taskData).then(() => res.redirect("/user/listUsers"))
    .catch((err)=>{
        console.error("Error assigning task to user:", err.message);
        res.status(500).send("Error assigning task to user");
    })

}

const getallTasksOfAUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by their ID
        const user = await User.query().findById(userId);

        // Retrieve the tasks associated with this user using withGraphFetched
        const userWithTasks = await User.query()
            .findById(userId)
            .withGraphFetched('tasks');

        // Check if the user has tasks
        if (!userWithTasks.tasks || userWithTasks.tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user.' });
        }

        // Count the number of pending tasks
        const pendingTasksCount = await User.query()
            .findById(userId)
            .withGraphFetched('tasks')
            .modifyGraph('tasks', (builder) => builder.where('task_type', 'Pending'))
            .then((user) => user.tasks.length);

        // Count the number of done tasks
        const doneTasksCount = await User.query()
            .findById(userId)
            .withGraphFetched('tasks')
            .modifyGraph('tasks', (builder) => builder.where('task_type', 'Done'))
            .then((user) => user.tasks.length);

        // Log the counts (optional)
        // console.log(user.name);

        // Return the tasks and user data to the view, along with counts
        res.render('./users/getAllTasksofUser', {
            user: userWithTasks.tasks,
            pendingCount: pendingTasksCount,
            doneCount: doneTasksCount,
            username : user.name
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'An error occurred while retrieving tasks.' });
    }
};





module.exports = {
    getallTasksOfAUser,
    getassignTasktoUser,
    assignTasktoUser,
    deleteUser,
    postEditUser,
    getUserToEdit,
    getAllUsers,
    getAddUser,
    addUser,
};
