const express = require('express');
const permission = require('./../middleware/permissions');
const router = express.Router();
const Lead = require('./../controllers/leadController');

router.post('/list', permission, function(req, res) {
    Lead.list(req,res);
});

router.post('/create', permission, function(req, res) {
    Lead.create(req,res);
});

router.post('/edit', permission, (req, res) => {
    Lead.edit(req,res);
})

router.post('/leads-assign', permission, (req, res) => {
    Lead.leadAssign(req,res);
})

module.exports = router;