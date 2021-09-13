const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('./roleModel');

/**************
 * validation not handle unique
 * 
 */

const userSchema = new Schema({
    name : {type : String, required:[true, "Name is required"]},
    email : {type : String, unique: true, required:[true, "Email is Required"]},
    phone : {type : Number, unique: true ,required:[true, "Phone is Required"]},
    role : {type : Schema.Types.ObjectId, ref: Role, required: [true, "User Role is Required"]},
    password: {type : String, required:[true, "Password is Required"]},
    parent : this,
    token: { type: String },
    created_at: { type: Date, default: Date.now},
    updated_at: { type:Date, default: Date.now},
    delated: { type:Date, default: null}

});

userSchema.methods.children = function (cb) {
    return this.model('User').find({parent : this.id}, cb).populate('role', ['name', 'email', 'phone', 'email']).select(['name', 'email', 'role']);
}

module.exports = mongoose.model('User', userSchema);
