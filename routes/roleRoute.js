const express = require('express');
const permission = require('./../middleware/permissions');
const router = express.Router();
const Role = require('./../controllers/roleController'); 

router.get('/list', permission, function(req, res){
    Role.list(req, res);
})

router.post('/create', permission, function(req, res){
    Role.create(req, res);
})

router.post('/edit', permission, function(req, res){
    Role.update(req, res);
})


module.exports = router;