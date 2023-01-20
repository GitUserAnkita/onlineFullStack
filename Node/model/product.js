const mongoose = require('mongoose');
const product = mongoose.Schema({
    name:{type: String, required: [true, "please Enter product Name"]},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    Image:{ type: String ,required:[true , "please upload image"] },    
    product_owner: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' },
    offer:{ type: mongoose.Schema.Types.ObjectId, ref: 'Offer' ,default:null},
    selling_price:{type:Number, required: [true, "please Insert selling price"]},
    quantity:{type:Number, required: [true, "please Enter quantity"]},
    size:{type:String},
    color:{type:String},
    material:{type:String},
    status:{type:String},
    description:{type:String,required: [true, "please Insert"]},
    shoe_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    visiteCount:{type:Number,default:0},
    rating:{type:Number},
    isDeleted:{type:Boolean,default:0},
    deletedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails' },

},
{timestamps:true});

const Product = mongoose.model('Product',product);
module.exports = Product;