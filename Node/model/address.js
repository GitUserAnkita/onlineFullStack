const mongooes = require('mongoose');
const address = mongooes.Schema({
    user: {type: mongooes.Schema.Types.ObjectId,ref:'UserDetails' },
    phone: { type: Number ,required:[true , "please Enter Phone number"]},
    pincode:{ type: Number ,required:[true , "please enter pincode"] },
    colony: { type: String ,required:[true , "please Enter colony"]},
    city: { type: String ,required:[true , "please Enter colony"] },
    state: { type: String ,required:[true , "please Enter colony"]},
    isDeleted:{ type: Boolean ,default:0},
    deletedBy:{ type: mongooes.Schema.Types.ObjectId,ref:'UserDetails' },
    country_code:{type:String}
},
{timestamps:true});

var Address = mongooes.model("Address", address);
module.exports = Address;
