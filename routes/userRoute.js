const express = require('express');
const router = express.Router();
const User = require('./../controllers/userController');
const permission = require('./../middleware/permissions');

router.get('/list', permission, (req, res) => {
    User.list(req, res);
});

router.post('/create', permission, (req, res) => {
    User.create(req, res)
});

router.post('/edit', (req, res) => {
    User.update(req, res)
});

router.post('/remove', (req, res) => {
    User.remove(req, res)
});


router.post('/descendants', (req, res) => {
    User.getDescendants(req, res)
});

router.post('/login', (req, res) => {
    User.login(req, res)
});


module.exports = router;
