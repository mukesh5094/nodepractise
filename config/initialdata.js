const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const loadData = async (req, res) => {
   
    /******* Lead Type ******* */
    let leadTypeData = require('./../models/leadTypeModel').LeadTypeData;
    let leadTypeModel = require('./../models/leadTypeModel').LeadType;
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

    /****Update type */
    let updateTypeData = require('../models/updateTypeModel').UpdateTypeData;
    let updateType = require('../models/updateTypeModel').UpdateType;
    updateType.findOne({}, (err, leadsource) => {
        if(err) return err;
        if(!leadsource){
            updateType.create(updateTypeData);
        }
    });

    /*****Role - user  - */
    let userModel = require('./../models/userModel');
    let roleModel = require('./../models/roleModel');
    roleModel.findOne({}, async (err, role) => {
        if(err) return err;
         if(!role){
            const  resource = [] ;
            
            roleModel.
            create([
                {
                    name : 'Admin',
                    description : "Super User",
                    resource : [
                        {
                            name: 'roles',
                            permissions : ['create', 'edit', 'delete', 'list']
                        },
                        {
                            name: 'users',
                            permissions : ['create', 'edit', 'delete', 'list']
                        },{
                            name: 'Lead Source',
                            permissions : ['create', 'edit', 'delete', 'list']
                        },{
                            name: 'Lead Type',
                            permissions : ['create', 'edit', 'delete', 'list']
                        },{
                            name: 'Division',
                            permissions : ['create', 'edit', 'delete', 'list']
                        }
                    ]
                }
            ], async (err1, role1) => {
                if(err1) return err1;
                if(role1){
                    let password = await bcrypt.hash('123456', 10);
                    let role_id = role1[0].id;
                    const admin = new userModel({ 
                        name : 'Admin', 
                        email : 'admin@gmail.com',
                        phone : 1234567890, 
                        password : password, 
                        parent : null,
                        role : role_id
                    });
                    admin.save( (err2, user) => {
                        if(err2) console.log(err2)
                    })
                }
               
            });
         }
    });
}
module.exports = loadData;