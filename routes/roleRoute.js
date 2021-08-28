const express = require('express');
const router = express.Router();
const Role = require('./../controllers/roleController'); 

router.get('/list', function(req, res){
    Role.list(req, res);
})

router.post('/create', function(req, res){
    Role.create(req, res);
})

router.post('/update', function(req, res){
    Role.update(req, res);
})

router.post('/update1', function(req, res){
    Role.update1(req, res);
})

module.exports = router;