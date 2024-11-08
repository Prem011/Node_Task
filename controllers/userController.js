const User = require('../models/User');

const renderUserForm = (req, res) => {
    res.render('userForm');
};

const addUser = async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        await User.query().insert({ name, email, mobile });
        res.redirect('/users/new');
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Error adding user.");
    }
};

module.exports = {
    renderUserForm,
    addUser,
};
