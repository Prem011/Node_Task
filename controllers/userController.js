const User = require('../models/User');

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


module.exports = {
    getAllUsers,
    getAddUser,
    addUser,
};
