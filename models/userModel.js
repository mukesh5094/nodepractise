const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**************
 * validation not handle unique
 * 
 */

const userSchema = new Schema({
    name : {type : String, required:[true, "Name is required"]},
    email : {type : String, required:[true, "Email is Required"]},
    phone : {type : Number,required:[true, "Phone is Required"]},
    role :  { type:mongoose.Schema.Types.ObjectId, ref : 'Role'},
    password: {type : String, required:[true, "Password is Required"]},
    parent : this,
    ancestors : [{
        id : this,
        name : String
    }],
    token: { type: String },
    status : { type : Number, default : 1},
    created_at: { type: Date, default: Date.now},
    updated_at: { type:Date, default: Date.now},
    delated: { type:Date, default: null}

});



userSchema.methods.children = function (cb) {
    return this.model('User').find({parent : this.id}, cb).populate('role', ['name', 'email', 'phone', 'email']).select(['name', 'email', 'role']);
}

module.exports = mongoose.model('User', userSchema);
