const Lead = require('./../models/leadModel');

exports.list = (req, res) => {
    Lead.
        find({}).
        populate('lead_source', 'name').
        populate('created_by', ['name', 'email', 'phone']).
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
    

    leadArray.forEach( async (element) => {
        const data = Lead.findById(element, async (err, lead) => {
            if(err) return res.status(400).json({status : 0, error : err1});
            let assignArray =  {
                user : req.body.user_id,
                assigned_by : req.user.user_id
            };
            

            lead.assigned_to.push(assignArray);

            lead.save((err1, lead) => {
                if(err1) return res.status(400).json({status : 0, error : err1});
                res.status(200).json({status:1, message : "Message Assigned Successfully"})
            });
        });
        
    });
   

}