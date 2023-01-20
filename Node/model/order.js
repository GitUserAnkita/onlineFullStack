var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const order = mongoose.Schema({

    products: [{
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true }
    }],
    userId: { type: Schema.Types.ObjectId, ref: "UserDetails", required: true },
    contact: { type: Number, required: true },
    status: { type: String, default: "payment pending" },

    paymentMethod: { type: String, default: "" },
    amount: {
        total: { type: Number , default: ""},
        shipping_charge: { type: Number },
        currency: { type: String ,default: ""},
        subtotal: { type: String },
    },
    shipping_address: {
        recipient_name: { type: String, default: "" },
        line1: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postal_code: { type: String, default: "" },
        country_code: { type: String, default: "" }
    }

});

var Order = mongoose.model("Orders", order);
module.exports = Order;
