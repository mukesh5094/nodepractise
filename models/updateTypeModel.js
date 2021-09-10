const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateTypeSchema = new Schema({
    name : { type : String , required : [ true, 'Field Is Required'] },
    subtype : [ {
        name : { type : String},
    }],
    status : { type : Number, enum : [0,1], default : 1},
    type : { type : String}
});

const UpdateTypeData = [
    { 
        name : "Call",
        subtype : [{ name : "Answered"},{ name : "Wrong Number"}, { name : "Number Busy"}],
    },{
        name : "Meeting",
        subtype : [ { name : "Owner" }, { name : "Coordinator"}, {name : "Business Manager"}, {name : "Executive"}],
    }
];

const  UpdateType = mongoose.model('UpdateType', updateTypeSchema);


module.exports = {UpdateType, UpdateTypeData};
