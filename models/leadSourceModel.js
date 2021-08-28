const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sourceSchema = new Schema({
    name: { type: String, required: [true,"Name is Required"] },
    status: { type: Number, default: 1},
    created_at: { type: Date, default: Date.now},
});

module.exports = mongoose.model('LeadSource', sourceSchema);