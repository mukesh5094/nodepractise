const Lead = require('./../models/leadModel');

exports.list = (req, res) => {
    Lead.
        find({}).
        populate('lead_source', 'name').
        populate('created_by', ['name', 'email', 'phone']).
        exec( (err, leads) => {
            if(err) res.status(400).json({status : 0, error : err});
            res.json({ status : 1, leads : leads});
    });
};

exports.create = (req, res) => {
    var lead = new Lead(req.body);
    lead.created_by =  req.user.user_id ;
    lead.save((err, lead) => {
        if(err) res.status(400).json({status : 0, err : err});
        res.status(200).json({status : 1, lead : lead});
  });
};


exports.edit = async (req, res) => {
    const query = { "_id": req.body.id };

    const update = await {
        "$set": {
            "name": req.body.name,
            "description": req.body.description,
            }
    };

    findOneAndUpdate(query, update, (err, lead) => {
        if(err) res.status(400).json({status : 0, err : err});
        console.log(lead)
    })
}