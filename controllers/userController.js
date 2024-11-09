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

        res.render('./users/listUsers', { users: users });
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
    console.log(user_name);
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
        console.error("Error adding task to user:", err.message);
        res.status(500).send("Error adding task to user");
    })

}

module.exports = {
    getassignTasktoUser,
    assignTasktoUser,
    deleteUser,
    postEditUser,
    getUserToEdit,
    getAllUsers,
    getAddUser,
    addUser,
};
