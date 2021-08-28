const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('./roleModel');

const userSchema = new Schema({
    name : {type : String, required:[true, "Name is required"]},
    email : {type : String, required:[true, "Email is Required"]},
    phone : {type : Number, required:[true, "Phone is Required"]},
    role : {type : Schema.Types.ObjectId, ref: Role, required: [true, "User Role is Required"]},
    password: {type : String, required:[true, "Password is Required"]},
    created_at: { type: Date, default: Date.now},
    updated_at: { type:Date, default: Date.now},
    delated: { type:Date, default: null}

});

module.exports = mongoose.model('User', userSchema);