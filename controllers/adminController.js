const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');  // Assuming you have an Admin model
const passport = require('passport');
const { get } = require('http');



const getRegister = (req, res) => {
    res.render('./admin/register');
}

const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if the admin already exists
        const existingAdmin = await Admin.query().findOne({ email });
        if (existingAdmin) {
            // If the admin exists, render the registration page with an error message
            return res.render('./admin/register', { message: 'Admin already exists.' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin record
        const newAdmin = await Admin.query().insert({
            username,
            email,
            password: hashedPassword,
        });

        // Render success message with the registration view
        res.render('./admin/', { message: 'Admin registered successfully!' });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.render('./admin/register', { message: 'Error registering admin.' });
    }
};

const getLogin = (req, res) => {
    res.render('./admin/index', {});
}

const login = (req, res) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, redirect to the admin dashboard or home page
        // return res.redirect('./');
        alert("Logged in successfully!");
    } else {
        // Render the login view if not authenticated
        // res.render('./', { message: 'Please log in.' });
        alert("problem logging")
    }
};

// Admin logout
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            // Render an error message if there's an issue logging out
            return res.render('./admin/index', { message: 'Error logging out.' });
        }
        // Render the login page with a success message after logging out
        res.render('./admin/index', { message: 'Admin logged out successfully!' });
    });
};

const dashboard = (req, res) => {
    res.render('./admin/dashboard', { message: 'Dashboard' });
}

module.exports = {
    dashboard,
    getLogin,
    getRegister,
    register,
    login,
    logout,
};
