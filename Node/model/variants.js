const mongoose = require('mongoose');
const variant = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: [true, 'please insert variant name'] }
}, {
    timestamps: true
});

var Variant = mongoose.model('Variant',variant);
module.exports = Variant;
