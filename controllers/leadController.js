const Lead = require('./../models/leadModel');

exports.list = function (req, res) {
    Lead.find({}, function(err, leads){
        if(err){
            res.status(400).send('Unable to save lead to database');
        }
        res.json({'leads' : leads});
    })
};

exports.create = function (req, res) {
    var lead = new Lead(req.body);
   
    lead.save(function (err) {
        if(err) {
            res.status(400).send('Unable to save lead to database');
        } else {
            res.json({'lead' : lead})
        }
  });
};