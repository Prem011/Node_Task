const express = require('express');
const router = express.Router();

router.get('/listUsers', (req, res) => {
    res.render('./users/listUsers', {})
})

router.get('/addUser', (req, res) => {
    res.render('./users/addUser', {})
})

module.exports = router;