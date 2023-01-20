const mongoose = require('mongoose');
const role = mongoose.Schema({
    role_name : {type:String,unique:true}
},
{
    timestamps: true
});

var Role = mongoose.model("role",role);
module.exports = Role;