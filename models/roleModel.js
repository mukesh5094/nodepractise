const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name : {type : String, required : [true, 'Name is Required']},
    description :   {type : String},
    resource :  [ 
                    { 
                        name : { type : String}, 
                        permissions : []
                    }
                ],
    status : { type : Number, default : 1 },
    created_at : {type : Date, default : Date.now},
    delated : { type:Date, default: null}

});

module.exports = mongoose.model('Role', roleSchema);