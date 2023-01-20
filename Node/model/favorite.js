const mongooes = require('mongoose');
const favorite = mongooes.Schema({
    likeBy: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
    product: { type: mongooes.Schema.Types.ObjectId, ref: 'Product' },
    isDeleted: { type: Boolean, default: 0 },
    dislikeBy: { type: mongooes.Schema.Types.ObjectId, ref: 'UserDetails' },
},
    { timestamps: true });

var Favorite = mongooes.model("Favorite", favorite);
module.exports = Favorite;
