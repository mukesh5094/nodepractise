const express = require('express');
const router = express.Router();
const Role = require('./../controllers/roleController'); 

router.get('/list', function(req, res){
    Role.list(req, res);
})

router.post('/create', function(req, res){
    Role.create(req, res);
})

router.post('/edit', function(req, res){
    Role.update(req, res);
})


module.exports = router;