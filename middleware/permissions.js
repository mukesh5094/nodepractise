const Role = require('./../models/roleModel');

const checkPermission = async (req, res, next) => {
    const fullurl = await req.originalUrl;
    const urlArray = await fullurl.split("/");
    
    Role.findById(req.user.role, async (err, role) => {
        if(err) console.log('permission error');
        var index = await role.resource.findIndex((response) => {
            return response.name == urlArray[1];   
        });

        if(index){
            const permission = await role.resource[index].permissions.includes(urlArray[2]);
            if(!permission){
                return res.status(400).json({status : 0, message : "Sorry! You have not Permission!"});
            }else{
                return next();
            }
        }else {
            return res.status(400).json({status : 0, message : "Module Not Found to Perform Operation"});
        }  
    });
   
}
module.exports = checkPermission ;