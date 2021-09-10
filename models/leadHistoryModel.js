const mongoose = require('mongoose');
const leadModel = require('./leadModel');
const UpdateType = require('./updateTypeModel').UpdateType;
const userModel = require('./userModel');
const Schema = mongoose.Schema;


const LeadHistory = new Schema({
    lead_id : { type : mongoose.Schema.Types.ObjectId,  ref : leadModel, required : [true, "Lead Id is Required"] },
    user_id : { type : mongoose.Schema.Types.ObjectId, ref : userModel, required : [true, "User id is required" ] },
    reminder : { type : Date, default : null},
    remark : { type : String, default : null},
    update_type : [{  maincat : { type : mongoose.Schema.Types.ObjectId, ref : UpdateType}, subcat : { type: String } }],
    other_info : { type : String, default : null},
    created_at : { type : Date, default : Date.now}
});

module.exports = mongoose.model('LeadHistory', LeadHistory);