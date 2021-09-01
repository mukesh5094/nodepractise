const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    name   : { type : String, required : true},
    module : { type : String, requited : true},
    status : { type : Number, default : 1 },
    created_at: { type: Date, default: Date.now},
})

const permission = mongoose.model('permission' , permissionSchema);

const permissionData = [
    {
        'name' : 'create',
        'module' : 'user',
        'status' : 1,
    },
    {
        'name' : 'edit',
        'module' : 'user',
        'status' : 1,
    },
    {
        'name' : 'delete',
        'module' : 'user',
        'status' : 1,
    },
]

module.exports = {permission,  permissionData}

