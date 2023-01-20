const mongooes = require('mongoose');
const user = mongooes.Schema({
    role: { type: mongooes.Schema.Types.ObjectId,ref:'role'},
    name: { type: String, required: [true , "please Enter Name"] },
    phone: { type: Number ,required:[true , "please Enter Phone number"]},
    Image:{ type: String ,required:[true , "please upload image"] },
    email: { type: String ,required:[true , "please Enter Email"],unique:true},
    password: { type: String },
    address: { type:String,required: [true , "please Enter address"] },
    isDeleted:{ type: Boolean ,default:0},
    DeletedBy:{ type: mongooes.Schema.Types.ObjectId,ref:'UserDetails' },
},
{timestamps:true});

var User = mongooes.model("UserDetails", user);
module.exports = User;
