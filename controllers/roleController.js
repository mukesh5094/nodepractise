const Role = require('./../models/roleModel')

exports.list =function(req, res){
    Role.find({}, function(err, roles){
        if(err){
            return res.status(401).json({ error: err });
        }
        return res.status(200).json({roles : roles})
    });
}

exports.create = function(req, res) {
    Role.create({
        name : req.body.name,
        description : req.body.description,
        resource : [
            {
                name: 'Role',
                permissions : []
            },
            {
                name: 'User',
                permissions : []
            },{
                name: 'Lead Source',
                permissions : []
            },{
                name: 'Lead Type',
                permissions : ['']
            },{
                name: 'Division',
                permissions : []
            }
        ] 
    }, (err, role) => {
        if(err){
            return res.status(401).json({ error: err });
        }
        
        return res.status(200).json({role : role});
    })
}

exports.update = function(req, res){
    Role.findById(req.body.id, (err, role) => {
        if(err){
            return res.status(401).json({ error: 'Unauthorized' });
        }
     
        role.name = req.body.name;
        role.description = req.body.description;
        role.resource = req.body.resource;
        role.save((err, data)=> {
            if(err){
                return res.status(401).json({ error: err });
            }
            return res.status(200).json({role : data});
        })
    })
}
