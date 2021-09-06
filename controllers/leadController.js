const Lead = require('./../models/leadModel');

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

    const update = await {
        "name": req.body.name,
        "description": req.body.description,
    };
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

            /*******Check lead assigend to same user***** */

            // let latest = await lead.assigned_to[Object.keys(lead.assigned_to)[Object.keys(lead.assigned_to).length - 1]] ;

            // if(latest.user !== req.body.user_id){
                let assignArray =  await {
                    user : req.body.user_id,
                    assigned_by : req.user.user_id
                };
                
                 lead.assigned_to.push(assignArray);
                // lead.assigned_to =assignArray;
                lead.save((err1, lead) => {
                   
                    if(err1) {};
                });
            // }
        });
    });
    return res.status(200).json({status : 1, message : "lead assigned !" , data : data});
}