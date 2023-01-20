const mongoose = require('mongoose');
const variantoption = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantName: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
    optionName:{type:String ,required:[true,'please insert variant option name']}
}, {
    timestamps: true
});

var VariantOption = mongoose.model('VariantOption',variantoption);
module.exports = VariantOption;
