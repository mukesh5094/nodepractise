const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/env');

const User = require('./../models/userModel')

function list(req, res){
    User.find({}).populate('role', ['name', 'email', 'phone', 'email']).populate(['parent', 'name']).exec((err, users) => {
        if(err) return res.status(400).json({status : 0, error : err});
        return res.status(200).json({status : 1, 'users' : users});
    })
}

const  create = async (req, res) => {
    try {
        const oldUser = await User.findOne({$or:[{email : req.body.email}, {phone : req.body.phone}]});
        if(!oldUser){
            //create hash password
            let password = await bcrypt.hash(req.body.password, 10);

            const user =  User.create({
                 'name' : req.body.name,
                 'email' : req.body.email,
                 'phone' : req.body.phone,
                 'password' : password,
                 'role' : req.body.role_id,
                 'parent' : req.body.parent
             }, async (err, data) => {
                if(err) return res.status(200).json({status : 0, err : err});
                
                const email = req.body.email;
                // create Token
                const token = await jwt.sign({user_id: data._id, email}, config.JWT_TOKEN_KEY, {expiresIn: "2h"});
    
                //save token
    
                data.token = token;
                data.save();
    
                return res.status(201).json({status : 1, msg : 'User Created Successfully'});
             });
             
        } else{
            if(oldUser.email === req.body.email) { 
                return res.status(400).json({ status: 0, msg: "User Already exist with same Email Id" });
            }
            if(oldUser.phone == req.body.phone) {
                return res.status(400).json({ status: 0, msg: "User Already exist with same Phone Number" });
            }
        }
        
    } catch(err){
        console.log(err);
    }

}

const update = async (req, res) => {
   
    User.findById(req.body.user_id, (err, user) => {
        if(err) return res.status(200).json({status : 0, error : err});
        if(user){
            user.name = req.body.name;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.role = req.body.role_id;
            user.parent = req.body.parent;
            user.save((err1, data) => {
                if(err1) return res.status(200).json({status : 0, error : err1})
                return res.status(200).json({ status : 1, msg : 'User Info Updated!'})
            })
        } else{
            return res.status(400).json({status : 0, users : 'Record Not found'});
        }
    })
}


module.exports = {
    list,
    create,
    update
};