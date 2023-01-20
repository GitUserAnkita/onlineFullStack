const mongoose = require('mongoose');
const productValue = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantName: {type: mongoose.Schema.Types.ObjectId, ref: 'Variant'  },
    variantOption: { type: mongoose.Schema.Types.ObjectId, ref: 'VariantOption'  },
    price: { type: Number,required:[true,'please insert price']}
}, {
    timestamps: true
});

var ProductValue = mongoose.model('ProductVariantValue',productValue);
module.exports = ProductValue;
