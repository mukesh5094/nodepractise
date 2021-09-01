const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const Role = require('./roleModel');
let Permission = require('./../models/permissionModel').permission;


const permissionRoleSchema = new Schema({
    
    role_id : { type : Schema.Types.ObjectId, ref : Role, required : true},
    permission_id : { type : Schema.Types.ObjectId, ref: Permission, required: true},
    created_at : {type : Date, default : Date.now}
});

module.exports = mongoose.model('PermissionRole', permissionRoleSchema);