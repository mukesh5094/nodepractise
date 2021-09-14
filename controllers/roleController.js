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
    try{
        Role.create({
            name : req.body.name,
            description : req.body.description,
            status : 1,
            order : 1,
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
    } catch (e){
        return res.status(500).send(e)
    }
}

exports.update = async function(req, res){
    try{
        let err = await Role.findByIdAndUpdate(req.body.id, { $set : {name : req.body.name, description : req.body.description, resource : req.body.resource, order : req.body.order, status : req.body.status}})
        if(err){
            return res.status(200).json({message : "Updated Successfully !"});  
        }
    } catch(e) {
        return res.status(500).send(e)
    }
}
