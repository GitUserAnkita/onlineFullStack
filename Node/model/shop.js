const mongooes = require('mongoose');
const shop = mongooes.Schema({
    shop_name: { type: String, required: [true, "please Enter Shop Name"] },
    shop_owner: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
    bussinessId: { type: Number, required: [true, "please Enter  Busssiness Id"] ,unique:true},
    city: { type: String, required: [true, "please Enter city"] },
    address: { type: String, required: [true, "please Enter address"] },
    // email: { type: String, required: [true, "please Enter Email"] },
    isDeleted: { type: Boolean, default: 0 },
    DeletedBy: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
},
    { timestamps: true });

var Shop = mongooes.model("Shop", shop);
module.exports = Shop;
