const Role = require('./../models/roleModel')
const User = require('./../models/userModel')

exports.list =function(req, res){
    Role.find({}, function(err, roles){
        if(err){
            return res.status(401).json({ error: err });
        }
        return res.status(200).json({roles : roles})
    });
}

exports.create = async function(req, res) {
    try{

    
        Role.create({
            name : req.body.name,
            description : req.body.description,
            status : 1,
            resource : [
                {
                    name: 'roles',
                    permissions : []
                },
                {
                    name: 'users',
                    permissions : []
                },{
                    name: 'leadsources',
                    permissions : []
                },{
                    name: 'leadtypes',
                    permissions : ['']
                },{
                    name: 'divisions',
                    permissions : []
                }
            ] 
        }, async (err, role) => {
            if(err){
                return res.status(401).json({ error: err });
            }
            
            let user = await User.findOne({ "_id":    req.user.user_id },{ "role_assigned_autority": 1  }).select({ _id : false }).exec();
            const authority = [...user.role_assigned_autority];
            authority.unshift({ role_id : role.id });
            user = await User.findByIdAndUpdate(req.user.user_id, { $set : { role_assigned_autority : authority}}).exec();
            
            if(user){
                return res.status(200).json({role : role});
            }
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
