const mongooes = require('mongoose');
const rating = mongooes.Schema({
    user: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
    product: { type: mongooes.Schema.Types.ObjectId, ref: 'Product' },
    star:{type:Number,min:1,max:5,required:true},
    message: { type: String },
    parent: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
    // isDeleted: { type: Boolean, default: 0 },
    // deletedBy: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
},
    { timestamps: true });

var Rating = mongooes.model("Rating", rating);
module.exports = Rating;
