const Role = require('./../models/roleModel')

exports.list =function(req, res){
    Role.find({}, function(err, roles){
        if(err){
            res.status(401).json({ error: err });
        }
        res.status(200).json({roles : roles})
    });
}

exports.create = function(req, res) {
    const role = new Role(req.body);
    role.save(function(err){
        if(err){
            res.status(401).json({ error: err });
        }
        res.status(200).json({role : role});
    })
}

exports.update = function(req, res) {
    Role.findByIdAndUpdate(req.body.id, { name: req.body.name }, (err, role) => {
        if(err){
            res.status(401).json({ error: 'Unauthorized' });
        }
        res.status(200).json({role : role});
    });
}

exports.update1 = function(req, res){
    Role.findById(req.body.id, (err, role) => {
        if(err){
            res.status(401).json({ error: 'Unauthorized' });
        }
       
        role.name = req.body.name;
        role.save((err, data)=> {
            if(err){
                res.status(401).json({ error: err });
            }
            res.status(200).json({role : data});
        })
    })
}