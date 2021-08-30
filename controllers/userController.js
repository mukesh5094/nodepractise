const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./../models/userModel')
const User = require('./../models/userModel')
const Role = require('./../models/roleModel')

function list(req, res){

    User.find({}).populate('role').exec((err, users) => {
        if(err) throw err
        return res.status(200).json({status : 1, 'users' : users});
    })
}


const  create = async (req, res) => {
    try {
        const role = await Role.findOne({name:req.body.role});
        if(!role) return res.status(400).json({ status: 0, msg: "Role Does Not Exist" });

        const oldUser = await User.findOne({$or:[{email : req.body.email}, {phone : req.body.phone}]});
        if(oldUser){
            if(oldUser.email === req.body.email) return res.status(400).json({ status: 0, msg: "User Already exist with same Email Id" });
            if(oldUser.phone === req.body.phone) return res.status(400).json({ status: 0, msg: "User Already exist with same Phone Number" });
        }

        //create hash password
        let password = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            'name' : req.body.name,
            'email' : req.body.email,
            'phone' : req.body.phone,
            'password' : password,
            'role' : role._id
        });
        const email = req.body.email;
        // create Token
        const token = await jwt.sign({user_id: user._id, email}, 'mysecretkey', {expiresIn: "2h"});

        //save token

        user.token = token;

        res.status(201).json(user);
    } catch(err){
        console.log(err);
    }

}

const login = async (req, res) => {
    const password =  req.body.password;
   
    const user = await User.findOne({$or:[{email : req.body.email}, {phone : req.body.phone}]}).populate('role');
    if(!user) return res.status(400).json({ status: 0, msg: "User not exist" });

    //Encrypr user password
    const encryptedPassword =  await bcrypt.compare(password, user.password);
    if(!encryptedPassword) return res.status(400).json({status : 0,  msg: "Password Do not match" });
    //create Token
    const email = user.email;
    const token = await jwt.sign( { user_id: user._id, email },'mysecretkey',{expiresIn: "2h",});
    
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

module.exports = {
    list,
    create,
    login
};