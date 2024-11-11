function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); 
        // console.log('isAuthenticated', req.isAuthenticated());
    }
    res.redirect('/');
}

module.exports = isAuthenticated;
