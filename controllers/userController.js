const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/env');

const User = require('./../models/userModel');
const Role = require('./../models/roleModel');

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
            
            let roleAuthority = await User.findOne({ "_id" : req.user.user_id, "role_assigned_autority.role_id" : req.body.role_id}).exec();
            
            if(!roleAuthority){
                return res.status(201).json({status : 0, message : "You have no authority to create user with this role"});
            }
            
            let parent = await User.findOne({"_id" : req.body.parent, 'ancestors._id' : req.user.user_id}).exec();
           
            if(!parent){
                
                return res.status(201).json({status : 0, message : "Parent user is not in your team"});
            }

          
            //create hash password
            let password = await bcrypt.hash(req.body.password, 10);

            const newUser =  User.create({
                 'name' : req.body.name,
                 'email' : req.body.email,
                 'phone' : req.body.phone,
                 'password' : password,
                 'role' : req.body.role_id,
                 'parent' : parent.id
             }, async (err, data) => {
                if(err) return res.status(200).json({status : 0, err : err});
                    const result = await buildAncestors(data.id, parent.id);
                    if(result){
                        // console.log(result);
                        return res.status(201).json({ status : 1, message : "user Created Successfully" });
                    } else{
                        return res.status(201).json({ status : 1, message : "user Created Successfully But ancesstor not" });
                    }
                    
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

        // const user = await User.
        //                     findByIdAndUpdate(req.body.user_id, 
        //                         { $set : {
        //                                 name : req.body.name,
        //                                 email : req.body.email,
        //                                 role : req.body.role_id,
        //                                 parent : req.body.parent
        //                             }
        //                         });
        // buildHierarchyAncestors(user._id, req.body.parent);

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
           return true;
         } else {
            return false;
         }

      } catch (err) {
        return true ;
          
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

 const roleAssignedToUser = async (req, res) => {
   
    try {
      
        let user = await User.findOne({ "_id" : req.body.user_id}, {"role_assigned_autority" : 1}).select({_id : false}).exec();

        const roleArray = [...user.role_assigned_autority];

        roleArray.unshift({ role_id : req.body.role_id });
        
        user = await User.findByIdAndUpdate(req.body.user_id, { $set : { role_assigned_autority : roleArray}}).exec();


        if(user){
            return res.status(200).json({status : 1, message : "Role added successfully"});
        }
     } catch (e){
         console.log(e);
         return res.status(500).send(e);
     }
 };
module.exports = {
    list,
    create,
    update,
    getDescendants,
    remove,
    roleAssignedToUser
};