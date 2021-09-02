const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Lead = require('./../models/leadModel');
const User = require('./../models/userModel');

const assignedSchema = new Schema({
    'lead_id' : {type : Schema.Types.ObjectId, ref : Lead, required: true},
    'user_id' : {type : Schema.Types.ObjectId, ref : User, required: true},
    'assigned_by' : {type : Schema.Types.ObjectId, ref : User, required: true},
    'status' : {type : Number, emum : [0,1], default : 1},
    'created_at' : {type : Date, default : Date.now},
});

module.exports = mongoose.model('LeadAssigned', assignedSchema);