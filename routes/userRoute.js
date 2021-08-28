const express = require('express');
const router = express.Router();
const User = require('./../controllers/userController');

router.get('/list', (req, res) => {
    User.list(req, res);
});

router.post('/create', (req, res) => {
    User.create(req, res)
});


module.exports = router;
