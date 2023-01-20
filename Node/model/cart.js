const mongooes = require('mongoose');
const cart = mongooes.Schema({
    user:{type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails'},
    cart : [{
        product :{type:mongooes.Schema.Types.ObjectId ,ref:"Product", required:true},
        quantity :{type:Number,required:true}
    }],
    abandon:{type:Number,default:1}
},
{timestamps:true});

var Cart = mongooes.model('Cart',cart);
module.exports = Cart;