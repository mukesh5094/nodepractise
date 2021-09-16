const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/env');
const User = require('./../models/userModel')

const register = async (req, res) => {
    try {
       
        const oldUser = await User.findOne({$or:[{email : req.body.email}, {phone : req.body.phone}]});
        if(!oldUser){
            //create hash password
            let password = await bcrypt.hash(req.body.password, 10);

            const user = User.create({
                 'name' : req.body.name,
                 'email' : req.body.email,
                 'phone' : req.body.phone,
                 'password' : password,
                 'role' : req.body.role_id,
                 'parent' : 0
             }, async (err, data) => {
                if(err) return res.status(200).json({status : 0, err : err});
                
                const email = req.body.email;
                const role = user.role;
                // create Token
                const token = await jwt.sign({user_id: data._id, email, role}, config.JWT_TOKEN_KEY, {expiresIn: "2h"});
    
                //save token
    
                data.token = token;
                data.save();
    
                res.status(201).json(data);
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

const login = async (req, res) => {
    const password =  req.body.password;
   
    const user = await User.findOne({$or:[{email : req.body.email}, {phone : req.body.phone}]}).populate('role');
    if(!user) return res.status(400).json({ status: 0, msg: "User not exist" });
    if(!user.role) return res.status(400).json({ status: 0, msg: "Role Not assigned" });
    //Encrypr user password
    const encryptedPassword =  await bcrypt.compare(password, user.password);
    if(!encryptedPassword) return res.status(400).json({status : 0,  msg: "Password Do not match" });
    //create Token
    const email = user.email;
    const role = user.role.id;
    const roleorder = user.role.order;
    const token = await jwt.sign( { user_id: user._id, email,  role, roleorder}, config.JWT_TOKEN_KEY, {expiresIn: "2h",});
    
    user.token = token;
    user.save();

    const data = {
        name : user.name,
        email : user.email,
        phone : user.phone,
        role : user.role.name
    }
    return res.status(200).json({ status: 1, user : data, token : token })
       
}

module.exports = { register, login}
