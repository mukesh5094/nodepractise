const jwt = require('jsonwebtoken');
const config = require('./../config/env');
const { where } = require('./../models/userModel');
const User = require('./../models/userModel');
const verifyToken = async (req, res, next) => {

    const fullurl = await req.originalUrl;
    const urlArray = await fullurl.split("/");
 
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token){
        return res.status(403).send("A token is required for authentication");
    }
    try{
        const decoded = await jwt.verify(token, config.JWT_TOKEN_KEY);
        const user = await User.find({ "token" : token, "_id" : decoded.user_id});
        if(!user){
            return res.status(401).send("Invalid Token");
        } else {
            req.user = decoded;
            return next();
        }
        

    } catch(e){
        return res.status(401).send("Invalid Token");
    }
    
}

module.exports = verifyToken ;