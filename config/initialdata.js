const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const loadData = async (req, res) => {
   /******* permission Data */
    let permissionData = require('./../models/permissionModel').permissionData;
    let permissionModel = require('./../models/permissionModel').permission;
    permissionModel.findOne({}, (err, permissions) => {
        if(err) return err;
        if(!permissions){
            permissionModel.create(permissionData);
        }
    });

    /******* Lead Type ******* */
    let leadTypeData = require('./../models/leadTypeModel').LeadTypeData;
    let leadTypeModel = require('./../models/leadTypeModel').leadType;
    leadTypeModel.findOne({}, (err, leadtype) => {
        if(err) return err;
        if(!leadtype){
            leadTypeModel.create(leadTypeData);
        }
    });

    /****** lead Source */
    let leadSourceData = require('./../models/leadSourceModel').LeadSourceData;
    let leadSourceModel = require('./../models/leadSourceModel').LeadSource;
    leadSourceModel.findOne({}, (err, leadsource) => {
        if(err) return err;
        if(!leadsource){
            leadSourceModel.create(leadSourceData);
        }
    });

    /*****Role - user  - */
    let userModel = require('./../models/userModel');
    let roleModel = require('./../models/roleModel');
    roleModel.findOne({}, (err, role) => {
        if(err) return err;
        if(!role){
            roleModel.create([{name : 'Admin'}], async (err1, role1) => {
                if(err1) return err1;
                if(role1){
                    let password = await bcrypt.hash('123456', 10);
                    let role_id = role1[0].id;
                    const admin = new userModel({ 
                        name : 'Admin', 
                        email : 'admin@gmail.com',
                        phone : 1234567890, 
                        password : password, 
                        role : role_id
                    });
                    admin.save( (err2, user) => {
                        if(err2) console.log(err2)
                    })
                }
               
            });
        }
    });

    /******Role Permission  */
    let PermissionRole = require('./../models/rolehasPermissionModel');
    let adminUser = await roleModel.findOne({});
    let permissions = await permissionModel.find({});
    const role_permission = [];
    if(permissions.length != 0){
        permissions.forEach( async permission => {
            await role_permission.push({ role_id : adminUser.id, permission_id :permission.id });
        })
        PermissionRole.create(role_permission);
    }

}
module.exports = loadData;