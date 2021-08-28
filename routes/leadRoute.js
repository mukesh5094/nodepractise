const express = require('express');
const router = express.Router();
const Lead = require('./../controllers/leadController');

router.get('/list', function(req, res) {
    Lead.list(req,res);
});

router.post('/create', function(req, res) {
    Lead.create(req,res);
});


module.exports = router;