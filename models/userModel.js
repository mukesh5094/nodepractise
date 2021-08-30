const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('./roleModel');

const userSchema = new Schema({
    name : {type : String, required:[true, "Name is required"]},
    email : {type : String, unique: true, required:[true, "Email is Required"]},
    phone : {type : Number, unique: true ,required:[true, "Phone is Required"]},
    role : {type : Schema.Types.ObjectId, ref: Role, required: [true, "User Role is Required"]},
    password: {type : String, required:[true, "Password is Required"]},
    token: { type: String },
    created_at: { type: Date, default: Date.now},
    updated_at: { type:Date, default: Date.now},
    delated: { type:Date, default: null}

});

module.exports = mongoose.model('User', userSchema);