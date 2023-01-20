var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productOffers = mongoose.Schema({
  discountPrice: {
    type: Number,
    required: [true, "please enter discount price"],
  },
  cat_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

var Offer = mongoose.model("Offer", productOffers);
module.exports = Offer;
