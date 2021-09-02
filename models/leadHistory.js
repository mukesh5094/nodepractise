const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lead = require('./../models/leadModel');
const User = require('./../models/userModel');


const historySchema = new Schema({
    'lead_id' : { type : mongoose.Types.ObjectId, ref : Lead, required : true },
    'user_id' : { type : mongoose.Types.ObjectId, ref : User, required : true },
    'type' : { type : String, required : true, enum : ['edit', 'update'], default : update},
    'update' : [ {remark : { type : String}}, {reminder : { type : Date}}]
});