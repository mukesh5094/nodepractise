const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new Schema ({
        name: { type: String, required: [true,"Name is Required"] },
        email: { type: String, required: [true,"Email is Required"] },
        phone: { type: Number, required: [true,"Phone is Required"] },
        lead_source: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadSource', required: [true, "Lead Source is Required"] },
        lead_type: { type: mongoose.Schema.Types.ObjectId, ref: 'LeadType', default : null},
        description: { type: String, required: [true,"Description is Required"] },
        created_by : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
        created_at: { type: Date, default: Date.now},
        updated_at: { type:Date, default: Date.now},
        delated: { type:Date, default: null}
});

leadSchema.path('email').validate((val) => {
        emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(val);
      }, 'Invalid E-mail');

module.exports = mongoose.model('Lead', leadSchema)