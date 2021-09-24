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

router.post('/role-assign', (req, res) => {
    User.roleAssignedToUser(req, res)
});

router.post('/remove', (req, res) => {
    User.remove(req, res)
});

router.post('/remove', (req, res) => {
    User.remove(req, res)
});

router.post('/changeParentAndTeam', (req, res) => {
    User.changeParentAndTeam(req, res)
});

router.post('/changeRole', (req, res) => {
    User.changeRole(req, res)
});

router.post('/login', (req, res) => {
    User.login(req, res)
});


module.exports = router;
