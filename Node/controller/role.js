const role = require('../model/role');

exports.role_type = (req,res) =>{
try{
   const body = req.body;
   if(Object.keys(body).length === 0 && body.constructor === Object){
    res.status(400).send({message:"data not proper formated..."})
}

else{
    const roleDetails = new role(body)
    roleDetails.save()
    .then((roleData)=>{
        res.status(200).send(roleData)
    }).catch(err=>{
        res.status(400).send({message:err.message})
    })
}
}catch(err){
 res.status(400).send(err)
}
}

exports.getAllRoles= async (req, res) => {
   try{
    var a ;
    role.find()
        .then(data => {
            res.status(200).send(data)
            a = data;   
        })
        .catch(err => {
            res.status(400).send({ message: err.message })
        })
        return a;  
   }catch(err){
    res.status(400).send(err)
   }
}