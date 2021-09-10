const moment = require('moment');
const Lead = require('./../models/leadModel');
const LeadHistory = require('./../models/leadHistoryModel');

exports.list = (req, res) => {
    let skip = 0
    let limit = 10;
    let sort = { 'created_at' : -1 };

    /********Filter *****/
    let filter ={};
    if (req.body.keyword_search) {
        filter  =   { $or : [ { name : {$regex: req.body.keyword_search, $options: 'i'}}, 
                              {email : {$regex: req.body.keyword_search, $options: 'i'}}
                            ]
                    }
    }
    
    if (req.body.lead_source) filter.lead_source = req.body.lead_source ;
    if (req.body.lead_type) filter.lead_type = req.body.lead_type;
   
    if(req.body.assigned_to) filter.assigned_to =  { $elemMatch: { user : req.body.assigned_to, status : 1} };
   
    /*******End Of Filter ******** */

    Lead.
        find(filter).
        populate('lead_source', 'name').
        populate('created_by', ['name']).
        populate('assigned_to.user', ['name']).
        populate('assigned_to.assigned_by', ['name']).
        sort(sort).
        limit(limit).
        skip(skip).
        exec( (err, leads) => {
            if(err) return res.status(400).json({status : 0, error : err});
            return res.json({ status : 1, leads : leads});
    });
};

exports.create = (req, res) => {
    var lead = new Lead(req.body);
    lead.created_by =  req.user.user_id ;
    lead.save((err, lead) => {
        if(err) return res.status(400).json({status : 0, err : err});
        return res.status(200).json({status : 1, lead : lead});
  });
};


exports.edit = async (req, res) => {
    const query = { "_id": req.body.id };
  
    
    Lead.findById(req.body.id, (err, lead) => {
        if(err) return res.status(400).json({status : 0, message : "Record Not Found"});
        lead.name = (req.body.name ? req.body.name : lead.name);
        lead.description = (req.body.description ? req.body.description : lead.description);
        lead.email = (req.body.email ? req.body.email : lead.email);
        lead.phone = (req.body.phone ? req.body.phone : lead.phone);
        lead.lead_source = (req.body.lead_source ? req.body.lead_source : lead.lead_source);
        lead.lead_type = (req.body.lead_type ? req.body.lead_type : lead.lead_type);

        lead.save((err1, lead) => {
            if(err1) return res.status(400).json({status : 0, error : err1});
            return res.status(200).json({status : 1, lead : lead, message : "Updated Successfully!"});
        });
    });
};

exports.leadAssign = async (req, res) => {
    const leadArray = req.body.leads;
    const data  = await leadArray.forEach( async (element) => {
        Lead.findById(element, async (err, lead) => {
            if(err) {};
                if(lead.assigned_to.length > 0){
                    lead.assigned_to[lead.assigned_to.length - 1].status = 0;
                }
                let assignArray =  await {
                    user : req.body.user_id,
                    assigned_by : req.user.user_id
                };
                lead.assigned_to.push(assignArray);

                lead.save((err1, lead) => {
                    if(err1) {};
                });
           
        });
    });
    return res.status(200).json({status : 1, message : "lead assigned !" , data : data});
}

exports.leadHistory = async (req, res) => {   
    const info = await Lead.findById(req.body.lead_id).populate('assigned_to.user');
    if(info){
        if(info.assigned_to.length > 0 && info.assigned_to[info.assigned_to.length - 1]['user'].id === req.user.user_id && info.assigned_to[info.assigned_to.length - 1]['status'] == 1){
            LeadHistory.create({
                'lead_id' : info.id,
                'user_id' : req.user.user_id,
                'reminder' : ((req.body.reminder) ? req.body.reminder : null),
                'remark' : req.body.remark,
                'update_type' : {
                    'maincat' : req.body.update_type,
                    'subcat' : req.body.update_sub_type
                },
                'other_info' : ((req.body.other_info) ? req.body.other_info : null)
            }, (err, history) => {
                if(err) return res.status(400).json({ status : 0, message : 'Something is Wrong!', error : err});
                return res.status(200).json({ status: 1, message : 'Lead reminder updated successfully'});
            })
        } else {
            return res.status(400).json({ status : 0, message : "Sorry! You have not permission to update this lead."});
        }
    } else {
        return res.status(400).json({ status : 0, message : "Record Not Found"});
    }
}

exports.getLeadHistory = async (req, res) => {
    let skip = 0
    let limit = 10;
    let sort = { 'created_at' : -1 };
    const filter = {};
    /**** User Filter  *****/
    if(req.body.user){
        filter.user_id = req.body.user;
    }
    /*******if date not set record only for one day *********** */
    if(req.body.from && req.body.to){
        const start = new Date(req.body.from);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.body.to);
        end.setHours(23, 59, 59, 999);
        filter.created_at ={
            $gte :start,
            $lt: end
        }
    } else {
        filter.created_at ={
            $gte : moment().startOf('day'),
            $lt: moment().endOf('day')
        }
    }
    /***********Update Type************* */
    if(req.body.update_type) filter.update_type =  { $elemMatch: { maincat : req.body.update_type} };


   
   
   
    LeadHistory.
        find(filter).
        populate('lead_id', ['id', 'name']).
        populate('user_id', ['id', 'name']).
        populate('update_type.maincat', ['id', 'name']).
        sort(sort).
        limit(limit).
        skip(skip).
        exec((err, histories) => {
           
            if(err) return res.status(400).json({ status : 0, error : err})
            if(histories){
                return res.status(200).json({ status : 1, list : histories});
            }
        });
}

exports.getReminders = async (req, res) => {

    /*******if date not set record only for one day *********** */
    if(req.body.from && req.body.to){
        const start = new Date(req.body.from);
        start.setHours(0, 0, 0, 0);
        const end = new Date(req.body.to);
        end.setHours(23, 59, 59, 999);
        filter.created_at ={
            $gte :start,
            $lt: end
        }
    } else {
        filter.created_at ={
            $gte : moment().startOf('day'),
            $lt: moment().endOf('day')
        }
    }
    
    LeadHistory.
        find({ sort: { '_id': -1 }}).
        distinct('lead_id').
        exec((err, reminders) => {
            if(err) return res.status(400).json({ status : 0, error : err})
            if(reminders){
                return res.status(200).json({ status : 1, list : reminders});
            }
        })

}