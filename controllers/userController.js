const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/env');
const { find, findByIdAndUpdate } = require('./../models/userModel');

const User = require('./../models/userModel')

function list(req, res){
    try{
        User.find({status : 1}).populate('role', ['name', 'email', 'phone', 'email']).populate('parent', ['name']).select(["name", "email", "role", "ancestors.name"]).exec((err, users) => {
            if(err) return res.status(400).json({status : 0, error : err});
            return res.status(200).json({status : 1, 'users' : users});
        })
    } catch (e){
        return res.status(500).send(err);
    }
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
                    buildAncestors(data.id, req.body.parent)
                    return res.status(201).json({ status : 1, message : "user Created Successfully" });
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
   try {

        const user = await User.
                            findByIdAndUpdate(req.body.user_id, 
                                { $set : {
                                        // name : req.body.name,
                                        email : req.body.email,
                                        role : req.body.role_id,
                                        parent : req.body.parent
                                    }
                                });
        buildHierarchyAncestors(user._id, req.body.parent);

    } catch (e){
        return res.status(500).send(e);
    }
};



const getDescendants = async (req, res ) => {
    try {
        const result = await User.find({"ancestors._id" : req.body.user_id}).select({ "_id": false, "name": true }).exec();

        return res.status(201).send({ "status": "success", "result": result });
    } catch (e){
        return res.status(500).send(e);
    }
}


const remove = async (req, res ) => {
    try{
        let info = await User.findByIdAndUpdate(req.body.user_id, { $set : { "status" : 0, "parent" : null,  ancestors : []}});
        
        if(info){
            let result = await User.find({parent : info.id}).exec();
            
            if(result){
                result.forEach((doc) => {
                    buildHierarchyAncestors(doc.id, info.parent)})
            }
        }
        
       
    } catch (e){
        return res.status(500).send(e)
    }
}
 


const buildAncestors = async (userid, parent_id) => {
    let ancest = [];
    try {
        let parent_category = await User.findOne({ "_id":    parent_id },{ "name": 1, "ancestors": 1  }).exec();
        if( parent_category ) {
            const { _id, name } = parent_category;
            const ancest = [...parent_category.ancestors];
            ancest.unshift({ _id, name })
           const category = await User.findByIdAndUpdate(userid, { $set: { "ancestors": ancest } });
         }
      } catch (err) {
          console.log(err.message)
       }
 }

 const buildHierarchyAncestors = async (userid, parent_id) => {
        if(userid && parent_id){
            buildAncestors(userid, parent_id);
            const result = await User.find({ 'parent': userid }).exec();
        

        if(result){
            result.forEach((doc) => {
                buildHierarchyAncestors(doc.id, userid)})
        }
    }
 }

module.exports = {
    list,
    create,
    update,
    getDescendants,
    remove
};