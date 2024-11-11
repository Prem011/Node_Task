const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');  // Assuming you have an Admin model
const passport = require('../config/passport');

// Render registration page
const getRegister = (req, res) => {
    res.render('./admin/register');
};

// Register a new admin
const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.query().findOne({ email });
        if (existingAdmin) {
            return res.render('./admin/register', { message: 'Admin already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        // Insert new admin
        await Admin.query().insert({
            username,
            email,
            password: hashedPassword,
        });

        req.flash('success', 'Admin registered successfully! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering admin:', error);
        res.render('./admin/register', { message: 'Error registering admin.' });
    }
};

// Render login page with flash messages
const getLogin = (req, res) => {
    res.render('./admin/index', { message: req.flash('error') });
};

// Handle admin login with passport
const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.render('./admin/index', { message: info.message });

        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect('/dashboard');
        });
    })(req, res, next);
};

// Admin logout
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.render('./admin/index', { message: 'Error logging out.' });
        }
        req.flash('success', 'Admin logged out successfully!');
        res.redirect('/');
    });
};

// Render admin dashboard
const dashboard = (req, res) => {
    res.render('./admin/dashboard', { user: req.user });
};

module.exports = {
    dashboard,
    getLogin,
    getRegister,
    register,
    login,
    logout,
};
