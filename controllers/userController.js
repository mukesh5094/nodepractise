const bcrypt = require('bcrypt');
const userModel = require('./../models/userModel')
const User = require('./../models/userModel')
const Role = require('./../models/roleModel')

function list(req, res){

    User.find({}).populate('role').exec((err, users) => {
        if(err){
            res.status(401).json({ error: 'Unauthorized' });
        }
        res.status(200).json({users : users});
    })
}


const  create = async (req, res) => {
    Role.findOne({name:req.body.role}, async (err, role) => {
        if(err){
            res.status(401).json({ error: 'Role Not Exist'})
        } 
        const user = new User(req.body);
        user.role = role._id

        let pass = await bcrypt.hash(req.body.password, 10);
        user.password = pass
        // user.password = '123456';
        
        user.save((err, user) => {
            if(err){
                res.status(401).json({error: err})
            }
            res.status(200).json({user : user});
        });
       

    })
}

module.exports = {
    list,
    create
};