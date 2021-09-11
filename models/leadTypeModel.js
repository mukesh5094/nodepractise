const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadTypeSchema = new Schema({
    name: { type: String, required: [true,"Name is Required"] },
    status: { type: Number, default: 1},
    created_at: { type: Date, default: Date.now},
})

const LeadType =  mongoose.model('LeadType', leadTypeSchema);

const LeadTypeData = [
    { 
        'name' : 'hot'
    }, 
    { 
        'name' : 'cold'
    },
    {
        'name' : 'dead'
    }
]

module.exports = { LeadType, LeadTypeData };