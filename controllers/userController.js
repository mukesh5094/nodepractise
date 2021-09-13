const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/env');

const User = require('./../models/userModel')

function list(req, res){
    User.find({}).populate('role', ['name', 'email', 'phone', 'email']).populate('parent', ['name']).exec((err, users) => {
        if(err) return res.status(400).json({status : 0, error : err});
        return res.status(200).json({status : 1, 'users' : users});
    })
};

const  create = async (req, res) => {
    try {
        const oldUser = await User.findOne({$or:[{email : req.body.email}, {phone : req.body.phone}]});
        if(!oldUser){
            //create hash password
            let password = await bcrypt.hash(req.body.password, 10);

            const newUser =  User.create({
                 'name' : req.body.name,
                 'email' : req.body.email,
                 'phone' : req.body.phone,
                 'password' : password,
                 'role' : req.body.role_id,
                 'parent' : req.body.parent
             }, async (err, data) => {
                if(err) return res.status(200).json({status : 0, err : err});
                try{
                    buildAncestors(newUser.id, req.body.parent)
                    return res.status(201).send({ response: `Category ${newCategory._id}` });
                }catch (e) {
                    return res.status(500).send(err);
                }

                /*****Generate Token */
                // const email = req.body.email;
                // const token = await jwt.sign({user_id: data._id, email}, config.JWT_TOKEN_KEY, {expiresIn: "2h"});
                // data.token = token;
                // data.save();
    
                // return res.status(201).json({status : 1, msg : 'User Created Successfully'});
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

};

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
};



const view = async (req, res) => {
    User.findById(req.body.user_id, (err, user) => {
        if(err) return res.status(200).json({status : 0, error : err});
        if(user){
           
            const children = user.children((err, children) => {
                console.log(children);
            });
          }
    })
};

const buildAncestors = async (id, parent_id) => {
    let ancest = [];
    try {
        let parent_category = await Category.findOne({ "_id":    parent },{ "name": 1 }).exec();
        if( parent_category ) {
           const { _id, name } = parent_category;
           const ancest = [...parent_category.ancestors];
           ancest.unshift({ _id, name })
           const category = await Category.findByIdAndUpdate(id, { $set: { "ancestors": ancest } });
         }
      } catch (err) {
          console.log(err.message)
       }
 }
module.exports = {
    list,
    create,
    update,
    view,
};