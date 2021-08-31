const express = require('express');
const router = express.Router();
const UserAuth = require('./../controllers/userAuthentication')

router.post('/register', (req, res) => {
    UserAuth.register(req, res);
})


router.post('/login', (req, res) => {
    UserAuth.login(req, res);
})

module.exports = router;